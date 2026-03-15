module View.Canvas exposing (drawDFA, stateRx, stateRy, ellipseEdge)

import Dict
import Html exposing (Html)
import Json.Decode as Decode
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Svg.Events as SvgEvents
import Html.Events exposing (custom)
import Types exposing (..)
import Helpers exposing (flt, mySqrt)






------------------ ELLIPSE GEOMETRY ---------------------------------

stateRx : String -> Float
stateRx name = Basics.max 28 (toFloat (String.length name) * 7.5 + 14)


stateRy : Float
stateRy = 22


ellipseEdge : StatePos -> Float -> Float -> Float -> Float -> ( Float, Float )
ellipseEdge pos dx dy rx ry =
    let
        dist = mySqrt (dx * dx + dy * dy)
    in
    if dist < 0.001 then
        (pos.x, pos.y)

    else
        let
            ux = dx / dist

            uy = dy / dist

            denom = mySqrt ((ux * ux) / (rx * rx) +  (uy * uy) / (ry * ry))

            scale = 1 / denom
        in
        ( pos.x + ux * scale,  pos.y + uy * scale )





--------------------------- SVG DRAWING -------------------------------------------

drawDFA : Model -> List (Svg Msg)
drawDFA model =
    let
        arrowDef =
            Svg.defs []
                [ Svg.marker
                    [ SvgAttr.id "arrow"
                    , SvgAttr.markerWidth "10"
                    , SvgAttr.markerHeight "10"
                    , SvgAttr.refX "8"
                    , SvgAttr.refY "3"
                    , SvgAttr.orient "auto"
                    , SvgAttr.markerUnits "strokeWidth"
                    ]
                    [ Svg.polygon
                        [ SvgAttr.points "0,0 0,6 9,3"
                        , SvgAttr.fill "#9fa8da"
                        ]
                        []
                    ]
                , Svg.marker
                    [ SvgAttr.id "arrow-active"
                    , SvgAttr.markerWidth "10"
                    , SvgAttr.markerHeight "10"
                    , SvgAttr.refX "8"
                    , SvgAttr.refY "3"
                    , SvgAttr.orient "auto"
                    , SvgAttr.markerUnits "strokeWidth"
                    ]
                    [ Svg.polygon
                        [ SvgAttr.points "0,0 0,6 9,3"
                        , SvgAttr.fill "#69f0ae"
                        ]
                        []
                    ]
                ]

        transitionList = Dict.toList model.transitions

        
        hasBidirectional from to =
            List.any (\( ( fr, _ ), tgt ) -> fr == to && tgt == from) transitionList

        
        groupedLabels =
            List.foldl
                (\( ( fr, ch ), to ) acc ->
                    let
                        key = fr ++ "__" ++ to

                        existing = Dict.get key acc |> Maybe.withDefault []
                    in
                    Dict.insert key (existing ++ [ ch ]) acc
                )
                Dict.empty
                transitionList

        
        transitionElements =
            Dict.keys groupedLabels
                |> List.filterMap
                    (\pairKey ->
                        let
                            parts = String.split "__" pairKey

                            chars = Dict.get pairKey groupedLabels |> Maybe.withDefault []

                            label = String.join "," chars
                        
                        in
                        case parts of
                            [ from, to ] ->
                                Maybe.map2
                                    (\fromPos toPos ->
                                        let
                                            isActive = model.currentState == Just from

                                            fromRx = stateRx from

                                            toRx = stateRx to
                                        in
                                        if from == to then
                                            drawSelfLoop label fromPos fromRx isActive model.drawTool from to

                                        else
                                            drawArrow label fromPos toPos fromRx toRx (hasBidirectional from to) isActive model.drawTool from to
                                    )
                                    (Dict.get from model.statePositions)
                                    (Dict.get to model.statePositions)

                            _ ->
                                Nothing
                    )
                |> List.concat

        stateElements =
            Dict.toList model.statePositions
                |> List.concatMap
                    (\( name, pos ) ->
                        drawState model
                            name
                            pos
                            (name == model.startState)
                            (List.member name model.acceptStates)
                            (model.currentState == Just name)
                            (model.transitionFrom == Just name)
                    )
    in
    arrowDef :: transitionElements ++ stateElements


drawState : Model -> String -> StatePos -> Bool -> Bool -> Bool -> Bool -> List (Svg Msg)
drawState model name pos isStart isAccept isCurrent isPending =
    let
        rx = stateRx name

        ry = stateRy

        fillColor =
            if isCurrent then
                "#1b5e20"

            else if model.drawTool == DeleteTool then
                "rgba(239,83,80,0.15)"

            else if isPending then
                "rgba(255,183,77,0.2)"

            else if isAccept then
                "rgba(79,195,247,0.15)"

            else
                "rgba(255,255,255,0.07)"

        strokeColor =
            if isCurrent then
                "#69f0ae"

            else if isPending then
                "#ffb74d"

            else if isAccept then
                "#4fc3f7"

            else if isStart then
                "#ffb74d"

            else
                "#9fa8da"

        strokeW =
            if isCurrent || isPending then "4" else "2.5"

        textFill =
            if isCurrent then "#69f0ae" else "#e8eaf6"

        cursorStr =
            case model.drawTool of
                SelectTool ->
                    case model.dragging of
                        Just d ->
                            if d.stateName == name then "grabbing" else "grab"

                        Nothing ->
                            "grab"

                AddTransitionTool ->
                    "crosshair"

                AddStateTool ->
                    "default"

                DeleteTool ->
                    "pointer"

        startArrow =
            if isStart then
                [ Svg.line
                    [ SvgAttr.x1 (flt (pos.x - rx - 30))
                    , SvgAttr.y1 (flt pos.y)
                    , SvgAttr.x2 (flt (pos.x - rx - 4))
                    , SvgAttr.y2 (flt pos.y)
                    , SvgAttr.stroke "#ffb74d"
                    , SvgAttr.strokeWidth "2.5"
                    , SvgAttr.markerEnd "url(#arrow)"
                    , SvgAttr.pointerEvents "none"
                    ]
                    []
                ]

            else
                []

        innerEllipse =
            if isAccept then
                [ Svg.ellipse
                    [ SvgAttr.cx (flt pos.x)
                    , SvgAttr.cy (flt pos.y)
                    , SvgAttr.rx (flt (rx - 5))
                    , SvgAttr.ry (flt (ry - 4))
                    , SvgAttr.fill "none"
                    , SvgAttr.stroke strokeColor
                    , SvgAttr.strokeWidth "1.5"
                    , SvgAttr.pointerEvents "none"
                    ]
                    []
                ]

            else
                []
    in
    startArrow
        ++ [ Svg.ellipse
                [ SvgAttr.cx (flt pos.x)
                , SvgAttr.cy (flt pos.y)
                , SvgAttr.rx (flt rx)
                , SvgAttr.ry (flt ry)
                , SvgAttr.fill fillColor
                , SvgAttr.stroke strokeColor
                , SvgAttr.strokeWidth strokeW
                , SvgAttr.cursor cursorStr
                , custom "click"
                    (Decode.succeed
                        { message = ClickedState name
                        , stopPropagation = True
                        , preventDefault = False
                        }
                    )
                , custom "dblclick"
                    (Decode.succeed
                        { message = StartRename name
                        , stopPropagation = True
                        , preventDefault = False
                        }
                    )
                , custom "mousedown"
                    (Decode.map2
                        (\ox oy ->
                            { message = MouseDownOnState name
                                ((ox - model.svgPanX) / model.svgZoom)
                                ((oy - model.svgPanY) / model.svgZoom)
                            , stopPropagation = True
                            , preventDefault = False
                            }
                        )
                        (Decode.field "offsetX" Decode.float)
                        (Decode.field "offsetY" Decode.float)
                    )
                ]
                []
           ]
        ++ innerEllipse
        ++ [ Svg.text_
                [ SvgAttr.x (flt pos.x)
                , SvgAttr.y (flt pos.y)
                , SvgAttr.textAnchor "middle"
                , SvgAttr.dominantBaseline "middle"
                , SvgAttr.fontSize "13"
                , SvgAttr.fontWeight "bold"
                , SvgAttr.fontFamily "monospace"
                , SvgAttr.fill textFill
                , SvgAttr.pointerEvents "none"
                ]
                [ Svg.text name ]
           ]


drawArrow : String -> StatePos -> StatePos -> Float -> Float -> Bool -> Bool -> DrawTool -> String -> String -> List (Svg Msg)
drawArrow label p1 p2 rx1 rx2 curved isActive drawTool from to =
    let
        dx = p2.x - p1.x

        dy = p2.y - p1.y

        dist = mySqrt (dx * dx + dy * dy)

        isDeleteMode = drawTool == DeleteTool

        strokeColor =
            if isDeleteMode then "#ef5350"
            else if isActive then "#69f0ae"
            else "#9fa8da"

        strokeW = if isActive then "2.5" else "2"

        markerUrl = if isActive then "url(#arrow-active)" else "url(#arrow)"

        ry = stateRy

        deleteClick path_ =
            if isDeleteMode then
                [ Svg.path
                    [ SvgAttr.d path_
                    , SvgAttr.stroke "transparent"
                    , SvgAttr.strokeWidth "14"
                    , SvgAttr.fill "none"
                    , SvgAttr.cursor "pointer"
                    , custom "click"
                        (Decode.succeed
                            { message = DeleteTransition from to
                            , stopPropagation = True
                            , preventDefault = False
                            }
                        )
                    ]
                    []
                ]
            else
                []

    in
    if curved then
        let
            nx = -(dy / dist)
            ny = dx / dist

            offset = 20
            (sx, sy) = ellipseEdge p1 (dx + nx * offset) (dy + ny * offset) rx1 ry

            (ex, ey) = ellipseEdge p2 (-(dx - nx * offset)) (-(dy - ny * offset)) rx2 ry

            cpx = (sx + ex) / 2 + nx *35

            cpy = (sy + ey) / 2 + ny *35

            lx = (sx + 2 * cpx + ex) / 4

            ly = (sy + 2 * cpy + ey) / 4 - 8

            pathStr =
                "M "
                    ++ flt sx ++ " " ++ flt sy
                    ++ " Q " ++ flt cpx ++ " " ++ flt cpy
                    ++ " " ++ flt ex ++ " " ++ flt ey
        
        in
        [ Svg.path
            [ SvgAttr.d pathStr
            , SvgAttr.stroke strokeColor
            , SvgAttr.strokeWidth strokeW
            , SvgAttr.fill "none"
            , SvgAttr.markerEnd markerUrl
            , SvgAttr.pointerEvents "none"
            ]
            []
        , transLabel lx ly label isActive
        ] ++ deleteClick pathStr

    else
        let
            (sx, sy) = ellipseEdge p1 dx dy rx1 ry

            (ex, ey) = ellipseEdge p2 (-dx) (-dy) rx2 ry

            mx = (sx + ex) / 2
            my = (sy + ey) / 2 - 10

            pathStr =
                "M " ++ flt sx ++ " " ++ flt sy
                ++ " L " ++ flt ex ++ " " ++ flt ey
        in
        [ Svg.line
            [ SvgAttr.x1 (flt sx)
            , SvgAttr.y1 (flt sy)
            , SvgAttr.x2 (flt ex)
            , SvgAttr.y2 (flt ey)
            , SvgAttr.stroke strokeColor
            , SvgAttr.strokeWidth strokeW
            , SvgAttr.markerEnd markerUrl
            , SvgAttr.pointerEvents "none"
            ]
            []
        , transLabel mx my label isActive
        ] ++ deleteClick pathStr


drawSelfLoop : String -> StatePos -> Float -> Bool -> DrawTool -> String -> String -> List (Svg Msg)
drawSelfLoop label pos rx isActive drawTool from to =
    let
        ry = stateRy

        isDeleteMode = drawTool == DeleteTool

        strokeColor =
            if isDeleteMode then "#ef5350"
            else if isActive then "#69f0ae"
            else "#9fa8da"

        strokeW = if isActive then "2.5" else "2"

        markerUrl = if isActive then "url(#arrow-active)" else "url(#arrow)"

        loopR = 13.0
        lcx = pos.x
        lcy = pos.y - ry - loopR - 1.0
        gap = 4.0
        ex = lcx - gap
        ey = lcy + loopR
        sx = lcx + gap
        sy = lcy + loopR

        pathD =
            "M " ++ flt sx ++ " " ++ flt sy
            ++ " A " ++ flt loopR ++ " " ++ flt loopR
            ++ " 0 1 0 "
            ++ flt ex ++ " " ++ flt ey

        lx = lcx
        ly = lcy - loopR - 5
    in
    [ Svg.path
        [ SvgAttr.d pathD
        , SvgAttr.stroke strokeColor
        , SvgAttr.strokeWidth strokeW
        , SvgAttr.fill "none"
        , SvgAttr.markerEnd markerUrl
        , SvgAttr.pointerEvents "none"
        ]
        []
    , transLabel lx ly label isActive
    ]
    ++ ( if isDeleteMode then
            [ Svg.path
                [ SvgAttr.d pathD
                , SvgAttr.stroke "transparent"
                , SvgAttr.strokeWidth "14"
                , SvgAttr.fill "none"
                , SvgAttr.cursor "pointer"
                , custom "click"
                    (Decode.succeed
                        { message = DeleteTransition from to
                        , stopPropagation = True
                        , preventDefault = False
                        }
                    )
                ]
                []
            ]
         else
            []
       )


transLabel : Float -> Float -> String -> Bool -> Svg Msg
transLabel x y label isActive =
    Svg.text_
        [ SvgAttr.x (flt x)
        , SvgAttr.y (flt y)
        , SvgAttr.textAnchor "middle"
        , SvgAttr.fontSize "12"
        , SvgAttr.fontWeight "bold"
        , SvgAttr.fontFamily "monospace"
        , SvgAttr.fill (if isActive then "#69f0ae" else "#f48fb1")
        , SvgAttr.pointerEvents "none"
        ]
        [ Svg.text label ]