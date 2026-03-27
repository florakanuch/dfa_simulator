module Simulation exposing (stepOnce, stepBack, runToEnd, checkAcceptance)

import Dict
import Types exposing (Model, Msg)
import Helpers exposing (listLast)
import Lang exposing (Translations)



stepOnce : Translations -> Model -> Model
stepOnce t model =
    case model.currentState of
        Nothing ->
            { model | simMessage = t.simLoadFirst }

        Just current ->
            if model.simPosition >= String.length model.testWord then
                checkAcceptance t model

            else
                let
                    ch = String.slice model.simPosition (model.simPosition + 1) model.testWord

                    next = Dict.get (current, ch) model.transitions
                in
                case next of
                    Just nextState ->
                        { model
                            | currentState = Just nextState
                            , simPosition = model.simPosition + 1
                            , simHistory =
                                model.simHistory ++ [ ( nextState, model.simPosition + 1 ) ]
                            , simMessage = t.simReadChar ch nextState
                        }

                    Nothing ->
                        { model
                            | currentState = Nothing
                            , simMessage = t.simNoTransition current ch
                        }


stepBack : Translations -> Model -> Model
stepBack t model =
    let
        histLen = List.length model.simHistory
    in
    if histLen <= 1 then
        { model
            | currentState = Just model.startState
            , simPosition = 0
            , simHistory = [ ( model.startState, 0 ) ]
            , simMessage = t.simBackToStart
        }

    else
        let
            newHistory = List.take (histLen - 1) model.simHistory

            prev = listLast newHistory
                    |> Maybe.withDefault ( model.startState, 0 )
        in
        { model
            | currentState = Just (Tuple.first prev)
            , simPosition = Tuple.second prev
            , simHistory = newHistory
            , simMessage = t.simSteppedBack (Tuple.first prev)
        }


runToEnd : Translations -> Model -> Model
runToEnd t model =
    let
        helper m =
            if m.simPosition >= String.length m.testWord then
                checkAcceptance t m

            else
                case m.currentState of
                    Nothing ->
                        m

                    Just _ ->
                        let
                            stepped = stepOnce t m
                        in
                        if stepped.currentState == Nothing then
                            stepped

                        else
                            helper stepped
    in
    helper model


checkAcceptance : Translations -> Model -> Model
checkAcceptance t model =
    case model.currentState of
        Nothing ->
            model

        Just current ->
            if List.member current model.acceptStates then
                { model | simMessage = t.simAccepted current }

            else
                { model | simMessage = t.simRejected current }