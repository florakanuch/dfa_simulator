module CodeSync exposing (syncCodeFromDiagram, generateDiagramFromCode)

import Dict
import Types exposing (Model)
import Helpers exposing (listUnique)
import Lang exposing (Language(..), translations)



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
                |> List.foldr
                    (\( ( fr, ch ), to ) acc ->
                        let
                            key = ( fr, to )
                        in
                        case Dict.get key acc of
                            Just syms -> Dict.insert key (ch :: syms) acc
                            Nothing -> Dict.insert key [ ch ] acc
                    )
                    Dict.empty
                |> Dict.toList
                |> List.map
                    (\( ( fr, to ), syms ) ->
                        fr ++ "," ++ String.join "|" syms ++ "," ++ to
                    )
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
        t = translations model.language
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

        parseTransLine : String -> Maybe ( String, List String, String )
        parseTransLine line =
            let
                parts = line |> String.split "," |> List.map String.trim
            in
            case parts of
                [ fr, ch, to ] ->
                    if fr /= "" && ch /= "" && to /= "" then
                        let
                            symbols =
                                ch
                                    |> String.split "|"
                                    |> List.map String.trim
                                    |> List.filter ((/=) "")
                        in
                        Just ( fr, symbols, to )
                    else
                        Nothing

                _ ->
                    Nothing

        parsedLines =
            model.codeTransitions
                |> String.lines
                |> List.filterMap parseTransLine

        impliedFromTransitions =
            parsedLines
                |> List.concatMap (\( fr, _, to ) -> [ fr, to ])

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
            parsedLines
                |> List.concatMap (\( _, syms, _ ) -> syms)

        extraAlphabet =
            impliedAlphabet
                |> List.filter (\s -> not (List.member s explicitAlphabet))
                |> listUnique

        mergedAlphabet = explicitAlphabet ++ extraAlphabet

        n = List.length stateNames

        radius = if n <= 1 then 0 else 190

        cxC = 450

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
                        ( name, { x = x, y = y } )
                    )
                |> Dict.fromList

        
        parsedTrans =
            parsedLines
                |> List.concatMap
                    (\( fr, syms, to ) ->
                        List.map (\sym -> ( ( fr, sym ), to )) syms
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
        , simMessage = t.diagramGenerated 
    }