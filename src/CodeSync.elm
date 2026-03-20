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
        explicitStates =
            model.codeStates
                |> String.split ","
                |> List.map String.trim
                |> List.filter ((/=) "")

        newStart = String.trim model.codeStart

        acceptList =
            model.codeAccept
                |> String.split ","
                |> List.map String.trim
                |> List.filter ((/=) "")

        
        startStates =
            if newStart /= "" then [ newStart ] else []

        impliedFromTransitions =
            model.codeTransitions
                |> String.lines
                |> List.filterMap
                    (\line ->
                        let
                            parts = line |> String.split "," |> List.map String.trim
                        in
                        case parts of
                            [ fr, _, to ] ->
                                if fr /= "" && to /= "" then Just [ fr, to ]
                                else Nothing
                            _ ->
                                Nothing
                    )
                |> List.concat

       
        allMentioned =
            startStates ++ acceptList ++ impliedFromTransitions

        extraStates =
            allMentioned
                |> List.filter (\s -> not (List.member s explicitStates))
                |> listUnique

        stateNames = explicitStates ++ extraStates

        explicitAlphabet =
            model.codeAlphabet
                |> String.split ","
                |> List.map String.trim
                |> List.filter ((/=) "")

        impliedAlphabet =
            model.codeTransitions
                |> String.lines
                |> List.filterMap
                    (\line ->
                        let
                            parts = line |> String.split "," |> List.map String.trim
                        in
                        case parts of
                            [ _, ch, _ ] ->
                                if ch /= "" then Just ch
                                else Nothing
                            _ ->
                                Nothing
                    )

        extraAlphabet =
            impliedAlphabet
                |> List.filter (\s -> not (List.member s explicitAlphabet))
                |> listUnique

        mergedAlphabet = explicitAlphabet ++ extraAlphabet

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
        , codeStates = String.join ", " stateNames
         , codeAlphabet = String.join ", " mergedAlphabet
        , currentState = Nothing
        , simPosition = 0
        , simHistory = []
        , simMessage = "Diagram generated from code."
    }