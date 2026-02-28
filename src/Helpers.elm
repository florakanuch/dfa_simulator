module Helpers exposing (..)



flt : Float -> String
flt = String.fromFloat


mySqrt : Float -> Float
mySqrt x = x ^ 0.5



listLast : List a -> Maybe a
listLast list =
    case list of
        [] -> Nothing

        [ x ] -> Just x

        _ :: rest -> listLast rest


listUnique : List comparable -> List comparable
listUnique =
    List.foldr
        (\x acc ->
            if List.member x acc then
                acc

            else
                x :: acc
        )
        []