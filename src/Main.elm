port module Main exposing (main)

import Browser
import Time
import Types exposing (Model, Msg(..))
import Update exposing (update, defaultModel)
import View exposing (view)
import Lang exposing (Language(..))



port requestExport : (() -> msg) -> Sub msg

port exportDFA : { states : String, alphabet : String, start : String, accept : String, transitions : String } -> Cmd msg

port openSaveModal : () -> Cmd msg

port openLoadModal : () -> Cmd msg

port importDFA : ({ states : String, alphabet : String, start : String, accept : String, transitions : String } -> msg) -> Sub msg

port sendLanguage : String -> Cmd msg

port keyboardMsg : (String -> msg) -> Sub msg


init : () -> ( Model, Cmd Msg )
init _ =
    ( defaultModel, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ if model.autoRunning then
            Time.every (toFloat (2100 - model.autoSpeed)) Types.AutoTick
          else
            Sub.none
        , importDFA (\d ->
            LoadDFAFromSave d.states d.alphabet d.start d.accept d.transitions
          )
        , requestExport (\_ -> GenerateCodeFromDiagram)
        , keyboardMsg (\key ->
            case key of
                "undo"   -> Undo
                "redo"   -> Redo
                "delete" -> KeyDelete
                _        -> NoOp
          )
        ]


updateWithPorts : Msg -> Model -> ( Model, Cmd Msg )
updateWithPorts msg model =
    case msg of
        GenerateCodeFromDiagram ->
            let
                newModel = update msg model
            in
            ( newModel
            , exportDFA
                { states      = newModel.codeStates
                , alphabet    = newModel.codeAlphabet
                , start       = newModel.codeStart
                , accept      = newModel.codeAccept
                , transitions = newModel.codeTransitions
                }
            )


        RequestSave ->
            ( model, openSaveModal () )

      
        RequestLoad ->
            ( model, openLoadModal () )

        ToggleLanguage ->
            let
                newModel = update msg model
                langStr = case newModel.language of
                    EN -> "EN"
                    SK -> "SK"
            in
            ( newModel, sendLanguage langStr )

        _ ->
            ( update msg model, Cmd.none )


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = updateWithPorts
        , subscriptions = subscriptions
        }