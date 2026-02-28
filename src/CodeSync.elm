module CodeSync exposing (syncCodeFromDiagram, generateDiagramFromCode)

import Dict
import Types exposing (Model)
import Helpers exposing (listUnique)



----------------------------- CODE <-> DIAGRAM SYNC -----------------------------------

syncCodeFromDiagram : Model -> Model
syncCodeFromDiagram model =
    let
        stateNames = Dict.keys model.statePositions

        alphabet =
            model.transitions
                |> Dict.keys
                |> List.map Tuple.second
                |> listUnique
                |> String.join ", "

        acceptStr = model.acceptStates |> String.join ", "

        transStr =
            model.transitions
                |> Dict.toList
                |> List.map (\( ( fr, ch ), to ) -> fr ++ "," ++ ch ++ "," ++ to)
                |> String.join "\n"
    
    in
    { model
        | codeStates = String.join ", " stateNames
        , codeAlphabet = alphabet
        , codeStart = model.startState
        , codeAccept = acceptStr
        , codeTransitions = transStr
    }



generateDiagramFromCode : Model -> Model
generateDiagramFromCode model =
    let
        stateNames =
            model.codeStates
                |> String.split ","
                |> List.map String.trim
                |> List.filter ((/=) "")

        acceptList =
            model.codeAccept
                |> String.split ","
                |> List.map String.trim
                |> List.filter ((/=) "")

        newStart = String.trim model.codeStart

        n = List.length stateNames

        radius = if n <= 1 then 0 else 190

        cxC =  450

        cyC = 260

        positions =
            stateNames
                |> List.indexedMap
                    (\i name ->
                        let
                            angle = (2 * pi * toFloat i / toFloat n) - pi / 2

                            x = cxC + radius * cos angle

                            y = cyC + radius * sin angle
                        
                        in
                        (name, {x = x, y = y})
                    )
                |> Dict.fromList

        parsedTrans =
            model.codeTransitions
                |> String.lines
                |> List.filterMap
                    (\line ->
                        let
                            parts = line |> String.split "," |> List.map String.trim
                        in
                        case parts of
                            [ fr, ch, to ] ->
                                if fr /= "" && ch /= "" && to /= "" then
                                    Just ((fr, ch), to)

                                else
                                    Nothing

                            _ ->
                                Nothing
                    )
                |> Dict.fromList
    in
    { model
        | statePositions = positions
        , startState = newStart
        , acceptStates = acceptList
        , transitions = parsedTrans
        , stateCounter = List.length stateNames
        , currentState = Nothing
        , simPosition = 0
        , simHistory = []
        , simMessage = "Diagram generated from code."
    }