module Main exposing (main)

import Browser
import Time
import Types exposing (Model, Msg)
import Update exposing (update, defaultModel)
import View exposing (view)



init : () -> ( Model, Cmd Msg )
init _ =
    ( defaultModel, Cmd.none )



subscriptions : Model -> Sub Msg
subscriptions model =
    if model.autoRunning then
        Time.every (toFloat (2100 - model.autoSpeed)) Types.AutoTick
    else
        Sub.none



main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = \msg model -> ( update msg model, Cmd.none )
        , subscriptions = subscriptions
        }