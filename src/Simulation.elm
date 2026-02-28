module Simulation exposing (stepOnce, stepBack, runToEnd, checkAcceptance)

import Dict
import Types exposing (Model, Msg)
import Helpers exposing (listLast)



stepOnce : Model -> Model
stepOnce model =
    case model.currentState of
        Nothing ->
            { model | simMessage = "Load DFA first!" }

        Just current ->
            if model.simPosition >= String.length model.testWord then
                checkAcceptance model

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
                            , simMessage = "Read '" ++ ch ++ "' → moved to " ++ nextState
                        }

                    Nothing ->
                        { model
                            | currentState = Nothing
                            , simMessage =
                                "✘ REJECTED: no transition from "
                                    ++ current
                                    ++ " on '"
                                    ++ ch
                                    ++ "'"
                        }


stepBack : Model -> Model
stepBack model =
    let
        histLen = List.length model.simHistory
    in
    if histLen <= 1 then
        { model
            | currentState = Just model.startState
            , simPosition = 0
            , simHistory = [ ( model.startState, 0 ) ]
            , simMessage = "Back to start."
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
            , simMessage = "Stepped back to " ++ Tuple.first prev
        }


runToEnd : Model -> Model
runToEnd model =
    let
        helper m =
            if m.simPosition >= String.length m.testWord then
                checkAcceptance m

            else
                case m.currentState of
                    Nothing ->
                        m

                    Just _ ->
                        let
                            stepped = stepOnce m
                        in
                        if stepped.currentState == Nothing then
                            stepped

                        else
                            helper stepped
    in
    helper model


checkAcceptance : Model -> Model
checkAcceptance model =
    case model.currentState of
        Nothing ->
            model

        Just current ->
            if List.member current model.acceptStates then
                { model | simMessage = "✔ ACCEPTED — in accept state: " ++ current }

            else
                { model | simMessage = "✘ REJECTED — not in accept state (current: " ++ current ++ ")" }