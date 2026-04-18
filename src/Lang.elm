module Lang exposing (Language(..), Translations, translations)
--import Types exposing (Msg(..))



type Language
    = EN
    | SK


type alias Translations =
   
    { guide : String
    , feedback : String
    , clearAll : String

   
    , stateDiagram : String
    , draw : String
    , selectMove : String
    , addState : String
    , addTransition : String
    , deleteStateTrans : String
    , actions : String
    , undo : String
    , redo : String
    , clearAllShort : String
    , view : String
    , zoomIn : String
    , zoomOut : String
    , resetView : String

   
    , statesCount : Int -> String
    , stateListHint : String

    
    , testString : String
    , enterTestWord : String
    , loadDfa : String
    , autoRun : String
    , run : String
    , stop : String
    , speed : String
    , stepByStep : String
    , reset : String
    , back : String
    , step : String
    , readAll : String
    , statusLabel : String
    , indexLabel : String
    , currentStateLabel : String

  
    , code : String
    , statesField : String
    , alphabetField : String
    , startStateField : String
    , acceptStatesField : String
    , transitionsField : String
    , generateDiagram : String
    , diagramGenerated : String 


    , renameState : String
    , rename : String
    , cancel : String
    , transitionLabel : String
    , transitionCharHint : String
    , add : String

    
    , helpTitle : String
    , whatIsApp : String
    , whatIsAppBody : String
    , helpSaveLoad : String
    , helpSave : String
    , helpSaveBody : String
    , helpLoad : String
    , helpLoadBody : String
    , helpEditing : String
    , helpSelect : String
    , helpSelectBody : String
    , helpAddState : String
    , helpAddStateBody : String
    , helpAddTrans : String
    , helpAddTransBody : String
    , helpDelete : String
    , helpDeleteBody : String
    , helpRename : String
    , helpRenameBody : String
    , helpSAX : String
    , helpSAXBody : String
    , helpPan : String
    , helpPanBody : String
    , helpZoom : String
    , helpZoomBody : String
    , helpUndoRedo : String
    , helpUndoItem : String
    , helpUndoBody : String
    , helpRedoItem : String
    , helpRedoBody : String
    , helpClearItem : String
    , helpClearBody : String
    , helpCodePanel : String
    , helpFormat : String
    , helpFormatBody : String
    , helpGenerate : String
    , helpGenerateBody : String
    , helpFields : String
    , helpFieldsBody : String
    , helpSimulation : String
    , helpTestWord : String
    , helpTestWordBody : String
    , helpLoadDfa : String
    , helpLoadDfaBody : String
    , helpRunStop : String
    , helpRunStopBody : String
    , helpSlider : String
    , helpSliderBody : String
    , helpBackStep : String
    , helpBackStepBody : String
    , helpReadAll : String
    , helpReadAllBody : String
    , helpResetSim : String
    , helpResetSimBody : String
    , helpStatusTitle : String
    , helpStatusField : String
    , helpStatusGeneral : String
    , helpStatusTestPanel : String
    , helpStatusCodePanel : String
    , helpStatusDiagram : String
    , helpIndexField : String
    , helpIndexGeneral : String
    , helpIndexTestPanel : String
    , helpIndexCodePanel : String
    , helpIndexDiagram : String
    , helpCurrentField : String
    , helpCurrentGeneral : String
    , helpCurrentTestPanel : String
    , helpCurrentCodePanel : String
    , helpCurrentDiagram : String
    , statusTestLabel : String
    , statusCodeLabel : String
    , statusDiagLabel : String
    , gotIt : String
    , helpSVG : String
    , helpSVGBtn : String

  
    , feedbackTitle : String
    , feedbackBody : String
    , openForm : String
    , close : String
    , save : String
    , load : String

   
    , simAdded : String -> String
    , simDeleted : String -> String
    , simRenamed : String -> String -> String
    , simSetStart : String -> String
    , simTransAdded : String -> String -> String -> String
    , simDeletedTrans : String -> String -> String
    , simGenerated : String
    , simCleared : String
    , simLoaded : String -> String
    , simReset : String
    , simPaused : String
    , simAutoStarted : String
    , simAutoResumed : String
    , simNothingUndo : String
    , simUndone : String
    , simNothingRedo : String
    , simRedone : String
    , simInitial : String

    
    , simLoadFirst : String
    , simReadChar : String -> String -> String
    , simNoTransition : String -> String -> String
    , simBackToStart : String
    , simSteppedBack : String -> String
    , simAccepted : String -> String
    , simRejected : String -> String

    
    , modalSaveTitle : String
    , modalSaveNamePlaceholder : String
    , modalSaveBtn : String
    , modalSavedDiagrams : String
    , modalLoadTitle : String
    , modalYourSavedDiagrams : String
    , modalLoadBtn : String
    , modalDeleteBtn : String
    , modalRenameBtn : String
    , modalNoSaves : String
    , toastSaved : String -> String
    , toastLoaded : String -> String
    , toastDeleted : String
    , toastNothingToSave : String
   
    , exportDfaBtn : String
    , exportSvgBtn : String
    , importDfaBtn : String
    , importHint : String
    , toastExported : String -> String
    , toastImported : String -> String
    , toastImportFailed : String
    , renameDiagramTitle : String
    , statsSuffix : Int -> Int -> String


    , settingsTitle : String
    , settingsLanguage : String
    , settingsAutoReorder : String
    , settingsAutoReorderDesc : String
    }


translations : Language -> Translations
translations lang =
    case lang of
        EN ->
            { guide = "📖 Guide"
            , feedback = "💬 Feedback"
            , clearAll = "🗑 Clear All"
            , stateDiagram = "State Diagram"
            , draw = "Draw"
            , selectMove = "Select/Move"
            , addState = "Add state"
            , addTransition = "Add transition"
            , deleteStateTrans = "Delete state/transition"
            , actions = "Actions"
            , undo = "Undo"
            , redo = "Redo"
            , clearAllShort = "Clear all"
            , view = "View"
            , zoomIn = "Zoom in"
            , zoomOut = "Zoom out"
            , resetView = "Reset view"
            , statesCount = \n -> "States  (" ++ String.fromInt n ++ ")"
            , stateListHint = "✎ rename · S start · A accept · X delete"
            , testString = "Test String"
            , enterTestWord = "Enter test word…"
            , loadDfa = "⚙ Load DFA"
            , autoRun = "Auto run"
            , run = "▶ Run"
            , stop = "⏹ Stop"
            , speed = "Speed"
            , stepByStep = "Step-by-step"
            , reset = "<< Reset"
            , back = "< Back"
            , step = "> Step"
            , readAll = ">> Read all"
            , statusLabel = "Status: "
            , indexLabel = "Index: "
            , currentStateLabel = "Current State: "
            , code = "Code"
            , statesField = "States"
            , alphabetField = "Alphabet"
            , startStateField = "Start state"
            , acceptStatesField = "Accept states"
            , transitionsField = "Transitions"
            , generateDiagram = "Generate diagram"
            , renameState = "Rename state: "
            , rename = "Rename"
            , cancel = "Cancel"
            , transitionLabel = "Transition: "
            , transitionCharHint = "Character(s) for this transition (use | for multiple, e.g. a|b|c): "
            , add = "Add"
            , helpTitle = "📖 Help & Controls"
            , whatIsApp = "What is this app?"
            , whatIsAppBody = "This tool is an interactive Deterministic Finite Automaton (DFA) simulator designed for college and university students. The goal is to help learners visually and interactively understand how automata work during theoretical computer science classes — how a DFA processes an input word, when it accepts, and when it rejects."
            , helpSaveLoad = " Save and Load"
            , helpSave = "Save"
            , helpSaveBody = "Save the current diagram to future use. You can rename the saved sloth, export to a .dfa file and also delete it."
            , helpLoad = "Load"
            , helpLoadBody = "Choose one sloth from SAVED DIAGRAMS or import a .dfa file and it will be loaded. The loaded diagram and code can be edited but it needs to be saved again separately after the editing."
            , helpEditing = " Editing the Diagram"
            , helpSelect = "✋ Select"
            , helpSelectBody = "Drag states to move them. Double-click a state to rename it."
            , helpAddState = "⊕ Add State"
            , helpAddStateBody = "Click on the empty canvas to place a new state."
            , helpAddTrans = "→ Add Transition"
            , helpAddTransBody = "Click the source state, then the target state. Enter the transition character."
            , helpDelete = "X Delete state/transition"
            , helpDeleteBody = "Click on a state or transition to delete it. You can also delete elements in other draw modes — if your cursor is hovering over a state or transition, click the Delete button on your keyboard. The hovered element will turn red to indicate it can be deleted. This is not a bug and you can continue drawing normally."
            , helpRename = "✎ Rename"
            , helpRenameBody = "Use the button in the state list or double-click directly on the state."
            , helpSAX = "S / A / X"
            , helpSAXBody = "S = set as start state, A = toggle accept state, × = delete state."
            , helpPan = "Pan"
            , helpPanBody = "Drag the empty canvas area to move the view."
            , helpZoom = "+ / − / ⌂"
            , helpZoomBody = "Zoom in, zoom out, and reset the view."
            , helpUndoRedo = "Undo / Redo / Clear"
            , helpUndoItem = "↩ Undo"
            , helpUndoBody = "Undo the last diagram change (up to 50 steps). You can also use Ctrl+Z."
            , helpRedoItem = "↪ Redo"
            , helpRedoBody = "Redo a previously undone action. You can also use Ctrl+Y"
            , helpClearItem = "🗑 Clear All"
            , helpClearBody = "Deletes all states, transitions and simulation data. This action CANNOT be undone."
            , helpCodePanel = "Code Panel"
            , helpFormat = "Format"
            , helpFormatBody = "One transition per line: from,character,to — e.g. q0,a,q1"
            , helpGenerate = "Generate diagram"
            , helpGenerateBody = "Automatically builds the diagram from the typed code, arranging states in a circle."
            , helpFields = "States / Alphabet / Start / Accept"
            , helpFieldsBody = "Fill in these fields for a formal DFA description. They update automatically when editing the diagram."
            , helpSimulation = "Simulation"
            , helpTestWord = "Test word"
            , helpTestWordBody = "Type the word you want to test (e.g. \"aab\")."
            , helpLoadDfa = "⚙ Load DFA"
            , helpLoadDfaBody = "Loads the DFA and sets the simulation to the start state. Press this first."
            , helpRunStop = "▶ Run / ⏹ Stop"
            , helpRunStopBody = "Run: automatically plays through the simulation at the set speed. Stop: pauses it."
            , helpSlider = "🐌 Speed slider 🐎"
            , helpSliderBody = "Adjust the speed of the automatic playback (slower ↔ faster)."
            , helpBackStep = "< Back / > Step"
            , helpBackStepBody = "Manually step through the simulation: go back or forward one character at a time."
            , helpReadAll = ">> Read all"
            , helpReadAllBody = "Processes the entire word at once and shows the final result."
            , helpResetSim = "<< Reset"
            , helpResetSimBody = "Resets the simulation back to the beginning."
            , helpStatusTitle = "What do the status indicators mean?"
            , helpStatusField = "Status"
            , helpStatusGeneral = "A text description of the current event. Green = ACCEPTED, Red = REJECTED, Purple = in progress."
            , helpStatusTestPanel = "Shown in the Test String panel and updates continuously as the simulation runs."
            , helpStatusCodePanel = "Determined by whether a valid transition exists in the transitions field for the current input character."
            , helpStatusDiagram = "The highlighted state on the canvas (green or red border) shows where the simulation currently is."
            , helpIndexField = "Index"
            , helpIndexGeneral = "Shows which character position in the input word the simulation is currently at (e.g. 2 / 4)."
            , helpIndexTestPanel = "Counts the characters of the word entered in the Test String field."
            , helpIndexCodePanel = "The transitions rows determine whether a valid transition exists at each index position."
            , helpIndexDiagram = "The active arrow on the diagram shows which character was just read."
            , helpCurrentField = "Current State"
            , helpCurrentGeneral = "The state the DFA is currently in. If shown as — (Nothing), the DFA has no valid transition and is stuck."
            , helpCurrentTestPanel = "Starts from the start state when Load DFA is pressed, then changes step by step."
            , helpCurrentCodePanel = "The start state field in the Code panel determines the initial Current State."
            , helpCurrentDiagram = "The state with the green border and dark green fill on the diagram is the current state."
            , statusTestLabel = "Test String: "
            , statusCodeLabel = "Code panel: "
            , statusDiagLabel = "State Diagram: "
            , gotIt = "Got it!"
            , feedbackTitle = "💬 Feedback"
            , feedbackBody = "I'd love to hear your thoughts! Fill out my quick form or send me an email."
            , openForm = "📋 Open Feedback Form"
            , close = "Close"
            , save = "Save"
            , load = "Load"
            , simAdded = \n -> "State added: " ++ n
            , simDeleted = \n -> "Deleted state: " ++ n
            , simRenamed = \o nw -> "Renamed: " ++ o ++ " → " ++ nw
            , simSetStart = \n -> "Start state set: " ++ n
            , simTransAdded = \fr ch to -> fr ++ " --[" ++ ch ++ "]--> " ++ to
            , simDeletedTrans = \fr to -> "Deleted transition: " ++ fr ++ " → " ++ to
            , simGenerated = "Diagram generated from code."
            , simCleared = "Cleared everything."
            , simLoaded = \w -> "Loaded. Ready to test: \"" ++ w ++ "\""
            , simReset = "Reset. Click 'Load DFA' to start."
            , simPaused = "Paused."
            , simAutoStarted = "Auto run started..."
            , simAutoResumed = "Auto run resumed..."
            , simNothingUndo = "Nothing to undo."
            , simUndone = "Undone."
            , simNothingRedo = "Nothing to redo."
            , simRedone = "Redone."
            , simInitial = "Add states by clicking the canvas."
            , simLoadFirst = "Load DFA first!"
            , simReadChar = \ch st -> "Read '" ++ ch ++ "' → moved to " ++ st
            , simNoTransition = \st ch -> "✘ REJECTED: no transition from " ++ st ++ " on '" ++ ch ++ "'"
            , simBackToStart = "Back to start."
            , simSteppedBack = \st -> "Stepped back to " ++ st
            , simAccepted = \st -> "✔ ACCEPTED — in accept state: " ++ st
            , simRejected = \st -> "✘ REJECTED — not in accept state (current: " ++ st ++ ")"
            , modalSaveTitle = "Save diagram"
            , modalSaveNamePlaceholder = "Name your save…"
            , modalSaveBtn = "Save"
            , modalSavedDiagrams = "Saved diagrams"
            , modalLoadTitle = "Load diagram"
            , modalYourSavedDiagrams = "Your saved diagrams"
            , modalLoadBtn = "↩ Load"
            , modalDeleteBtn = "X"
            , modalRenameBtn = "✎"
            , modalNoSaves = "No saved diagrams yet.\nBuild something and save it!"
            , toastSaved = \n -> "Saved \"" ++ n ++ "\""
            , toastLoaded = \n -> "Loaded \"" ++ n ++ "\""
            , toastDeleted = "Deleted"
            , toastNothingToSave = "Nothing to save yet."
            , exportDfaBtn = "💾 .dfa"
            , exportSvgBtn = "Download SVG"
            , helpSVG = "Download SVG"
            , helpSVGBtn = "Download an .svg image of the state diagram."
            , importDfaBtn = "📂 Import .dfa file"
            , importHint = "Load a diagram from your computer"
            , toastExported = \n -> "Exported \"" ++ n ++ ".dfa\""
            , toastImported = \n -> "Imported \"" ++ n ++ "\""
            , toastImportFailed = "Failed to read file."
            , renameDiagramTitle = "Rename"
            , statsSuffix = \sc tc -> String.fromInt sc ++ " state" ++ (if sc /= 1 then "s" else "") ++ "  ·  " ++ String.fromInt tc ++ " transition" ++ (if tc /= 1 then "s" else "")
            , settingsTitle = "Settings"
            , settingsLanguage = "Language"
            , settingsAutoReorder = "Auto-renumber states on delete"
            , settingsAutoReorderDesc = "When deleting q2, all higher states (q3, q4…) are renamed down by one."
            , diagramGenerated = "Diagram generated from code."
            }

        SK ->
            { guide = "📖 Návod"
            , feedback = "💬 Spätná väzba"
            , clearAll = "🗑 Vymazať všetko"
            , stateDiagram = "Stavový diagram"
            , draw = "Kresliť"
            , selectMove = "Vybrať/Presunúť"
            , addState = "Pridať stav"
            , addTransition = "Pridať prechod"
            , deleteStateTrans = "Odstrániť stav/prechod"
            , actions = "Akcie"
            , undo = "Späť"
            , redo = "Znova"
            , clearAllShort = "Vymazať všetko"
            , view = "Zobrazenie"
            , zoomIn = "Priblížiť"
            , zoomOut = "Oddialiť"
            , resetView = "Resetovať pohľad"
            , statesCount = \n -> "Stavy  (" ++ String.fromInt n ++ ")"
            , stateListHint = "✎ premenovať · S začiatočný · A akceptačný · X odstrániť"
            , testString = "Testovací reťazec"
            , enterTestWord = "Zadaj testové slovo…"
            , loadDfa = "⚙ Načítať DKA"
            , autoRun = "Automatický beh"
            , run = "▶ Spustiť"
            , stop = "⏹ Zastaviť"
            , speed = "Rýchlosť"
            , stepByStep = "Krok po kroku"
            , reset = "<< Reset"
            , back = "< Späť"
            , step = "> Krok"
            , readAll = ">> Prečítať všetko"
            , statusLabel = "Stav: "
            , indexLabel = "Index: "
            , currentStateLabel = "Aktuálny stav: "
            , code = "Kód"
            , statesField = "Stavy"
            , alphabetField = "Abeceda"
            , startStateField = "Začiatočný stav"
            , acceptStatesField = "Akceptačné stavy"
            , transitionsField = "Prechody"
            , generateDiagram = "Generovať diagram"
            , renameState = "Premenovať stav: "
            , rename = "Premenovať"
            , cancel = "Zrušiť"
            , transitionLabel = "Prechod: "
            , transitionCharHint = "Znak(y) pre tento prechod(použi | pre viac, napr. a|b|c):"
            , add = "Pridať"
            , helpTitle = "📖 Návod a ovládanie"
            , whatIsApp = "Čo je táto aplikácia?"
            , whatIsAppBody = "Tento nástroj je interaktívny simulátor Deterministického Konečného Automatu (DKA) určený pre študentov vysokých škôl. Cieľom je pomôcť študentom vizuálne a interaktívne pochopiť, ako automaty fungujú v rámci predmetov teoretickej informatiky — ako DKA spracúva vstupné slovo, kedy ho prijme a kedy odmietne."
            , helpSaveLoad = " Uložiť a načítať"
            , helpSave = "Uložiť"
            , helpSaveBody = "Uloží aktuálny diagram na neskoršie použitie. Môžeš ho premenovať, stiahnúť ako .dfa súbor alebo odstrániť."
            , helpLoad = "Načítať"
            , helpLoadBody = "Vyber diagram zo ULOŽENÝCH DIAGRAMOV alebo načítať .dfa súbor a bude načítaný. Načítaný diagram a kód možno upravovať, ale treba ich znova uložiť."
            , helpEditing = " Úprava diagramu"
            , helpSelect = "✋ Vybrať"
            , helpSelectBody = "Ťahaj stavy na presun. Dvojklikom na stav ho premenuj."
            , helpAddState = "⊕ Pridať stav"
            , helpAddStateBody = "Klikni na prázdne plátno pre umiestnenie nového stavu."
            , helpAddTrans = "→ Pridať prechod"
            , helpAddTransBody = "Klikni na zdrojový stav, potom na cieľový stav. Zadaj znak prechodu."
            , helpDelete = "X Odstrániť stav/prechod"
            , helpDeleteBody = "Klikni na stav alebo prechod pre jeho odstránenie. Prvky môžeš odstrániť aj v iných režimoch kreslenia — ak je kurzor nad stavom alebo prechodom, stačí kliknúť na tlačidlo Delete na klávesnici. Zvýraznený prvok sa zobrazí červenou farbou, čo znamená, že ho možno odstrániť. Nie je to chyba a kreslenie môžeš normálne používať ďalej."
            , helpRename = "✎ Premenovať"
            , helpRenameBody = "Použi tlačidlo v zozname stavov alebo dvojklikni priamo na stav."
            , helpSAX = "S / A / X"
            , helpSAXBody = "S = nastaviť ako začiatočný stav, A = prepnúť akceptačný stav, × = odstrániť stav."
            , helpPan = "Posun"
            , helpPanBody = "Ťahaj prázdnu plochu plátna na posun pohľadu."
            , helpZoom = "+ / − / ⌂"
            , helpZoomBody = "Priblížiť, oddialiť a resetovať pohľad."
            , helpUndoRedo = "Späť / Znova / Vymazať"
            , helpUndoItem = "↩ Späť"
            , helpUndoBody = "Vráti poslednú zmenu diagramu (až 50 krokov). Môžeš použiť aj Ctrl+Z."
            , helpRedoItem = "↪ Znova"
            , helpRedoBody = "Zopakuje predtým vratenú akciu. Môžeš použiť aj Ctrl+Y."
            , helpClearItem = "🗑 Vymazať všetko"
            , helpClearBody = "Odstráni všetky stavy, prechody a simulačné dáta. Túto akciu NEMOŽNO vrátiť."
            , helpCodePanel = "Panel kódu"
            , helpFormat = "Formát"
            , helpFormatBody = "Jeden prechod na riadok: odkiaľ,znak,kam — napr. q0,a,q1"
            , helpGenerate = "Generovať diagram"
            , helpGenerateBody = "Automaticky zostaví diagram z napísaného kódu, stavy rozmiestnení do kruhu."
            , helpFields = "Stavy / Abeceda / Začiatok / Akceptačné"
            , helpFieldsBody = "Vyplň tieto polia pre formálny popis DKA. Automaticky sa aktualizujú pri úprave diagramu."
            , helpSimulation = "Simulácia"
            , helpTestWord = "Testové slovo"
            , helpTestWordBody = "Zadaj slovo, ktoré chceš otestovať (napr. \"aab\")."
            , helpLoadDfa = "⚙ Načítať DKA"
            , helpLoadDfaBody = "Načíta DKA a nastaví simuláciu na začiatočný stav. Stlač toto tlačidlo ako prvé."
            , helpRunStop = "▶ Spustiť / ⏹ Zastaviť"
            , helpRunStopBody = "Spustiť: automaticky prehráva simuláciu nastavenou rýchlosťou. Zastaviť: pozastaví ju."
            , helpSlider = "🐌 Posuvník rýchlosti 🐎"
            , helpSliderBody = "Nastav rýchlosť automatického prehrávania (pomalšie ↔ rýchlejšie)."
            , helpBackStep = "< Späť / > Krok"
            , helpBackStepBody = "Manuálne prechádzaj simuláciou: jeden znak dozadu alebo dopredu."
            , helpReadAll = ">> Prečítať všetko"
            , helpReadAllBody = "Spracuje celé slovo naraz a zobrazí výsledok."
            , helpResetSim = "<< Reset"
            , helpResetSimBody = "Resetuje simuláciu na začiatok."
            , helpStatusTitle = "Čo znamenajú stavové ukazovatele?"
            , helpStatusField = "Stav"
            , helpStatusGeneral = "Textový popis aktuálnej udalosti. Zelená = PRIJATÝ, Červená = ODMIETNUTÝ, Fialová = prebieha."
            , helpStatusTestPanel = "Zobrazený v paneli Testovacieho reťazca, priebežne sa aktualizuje počas simulácie."
            , helpStatusCodePanel = "Závisí od toho, či v poli prechodov existuje platný prechod pre aktuálny vstupný znak."
            , helpStatusDiagram = "Zvýraznený stav na plátne (zelený alebo červený okraj) ukazuje, kde sa simulácia aktuálne nachádza."
            , helpIndexField = "Index"
            , helpIndexGeneral = "Ukazuje, na ktorej pozícii vstupného slova sa simulácia nachádza (napr. 2 / 4)."
            , helpIndexTestPanel = "Počíta znaky slova zadaného v poli Testovacieho reťazca."
            , helpIndexCodePanel = "Riadky prechodov určujú, či na každej pozícii existuje platný prechod."
            , helpIndexDiagram = "Aktívna šípka na diagrame ukazuje, ktorý znak bol práve prečítaný."
            , helpCurrentField = "Aktuálny stav"
            , helpCurrentGeneral = "Stav, v ktorom sa DKA aktuálne nachádza. Ak je zobrazené — (Nothing), DKA nemá platný prechod a je zaseknutý."
            , helpCurrentTestPanel = "Začína zo začiatočného stavu po stlačení Načítať DKA, potom sa mení krok po kroku."
            , helpCurrentCodePanel = "Pole začiatočného stavu v paneli Kódu určuje počiatočný Aktuálny stav."
            , helpCurrentDiagram = "Stav so zeleným okrajom a tmavozelenou výplňou na diagrame je aktuálny stav."
            , statusTestLabel = "Testovací reťazec: "
            , statusCodeLabel = "Panel kódu: "
            , statusDiagLabel = "Stavový diagram: "
            , gotIt = "Rozumiem!"
            , feedbackTitle = "💬 Spätná väzba"
            , feedbackBody = "Rada si vypočujem vaše názory! Vyplňte môj krátky formulár alebo mi napíšte e-mail."
            , openForm = "📋 Otvoriť formulár"
            , close = "Zavrieť"
            , save = "Uložiť"
            , load = "Načítať"
            , simAdded = \n -> "Stav pridaný: " ++ n
            , simDeleted = \n -> "Stav odstránený: " ++ n
            , simRenamed = \o nw -> "Premenovaný: " ++ o ++ " → " ++ nw
            , simSetStart = \n -> "Začiatočný stav nastavený: " ++ n
            , simTransAdded = \fr ch to -> fr ++ " --[" ++ ch ++ "]--> " ++ to
            , simDeletedTrans = \fr to -> "Prechod odstránený: " ++ fr ++ " → " ++ to
            , simGenerated = "Diagram vygenerovaný z kódu."
            , simCleared = "Všetko vymazané."
            , simLoaded = \w -> "Načítané. Pripravené na test: \"" ++ w ++ "\""
            , simReset = "Reset. Stlač 'Načítať DKA' pre začiatok."
            , simPaused = "Pozastavené."
            , simAutoStarted = "Automatický beh spustený..."
            , simAutoResumed = "Automatický beh obnovený..."
            , simNothingUndo = "Nie je čo vrátiť."
            , simUndone = "Vrátené."
            , simNothingRedo = "Nie je čo zopakovať."
            , simRedone = "Zopakované."
            , simInitial = "Pridaj stavy kliknutím na plátno."
            , simLoadFirst = "Najprv načítaj DKA!"
            , simReadChar = \ch st -> "Prečítaný '" ++ ch ++ "' → prechod do " ++ st
            , simNoTransition = \st ch -> "✘ ODMIETNUTÝ: žiadny prechod z " ++ st ++ " pre '" ++ ch ++ "'"
            , simBackToStart = "Späť na začiatok."
            , simSteppedBack = \st -> "Krok späť do " ++ st
            , simAccepted = \st -> "✔ PRIJATÝ — akceptačný stav: " ++ st
            , simRejected = \st -> "✘ ODMIETNUTÝ — nie je v akceptačnom stave (aktuálny: " ++ st ++ ")"
            , modalSaveTitle = "Uložiť diagram"
            , modalSaveNamePlaceholder = "Pomenuj uloženie…"
            , modalSaveBtn = "Uložiť"
            , modalSavedDiagrams = "Uložené diagramy"
            , modalLoadTitle = "Načítať diagram"
            , modalYourSavedDiagrams = "Tvoje uložené diagramy"
            , modalLoadBtn = "↩ Načítať"
            , modalDeleteBtn = "X"
            , modalRenameBtn = "✎"
            , modalNoSaves = "Žiadne uložené diagramy.\nNiečo vytvor a ulož!"
            , toastSaved = \n -> "Uložené \"" ++ n ++ "\""
            , toastLoaded = \n -> "Načítané \"" ++ n ++ "\""
            , toastDeleted = "Odstránené"
            , toastNothingToSave = "Zatiaľ nič na uloženie."
            , exportDfaBtn = "💾 .dfa"
            , helpSVG = "Stiahnúť SVG"
            , helpSVGBtn = "Stiahne stavový diagram ako .svg súbor."
            , exportSvgBtn = "Stiahnúť SVG"
            , importDfaBtn = "📂 Importovať .dfa súbor"
            , importHint = "Načítať diagram z počítača"
            , toastExported = \n -> "Exportované \"" ++ n ++ ".dfa\""
            , toastImported = \n -> "Importované \"" ++ n ++ "\""
            , toastImportFailed = "Nepodarilo sa načítať súbor."
            , renameDiagramTitle = "Premenovať"
            , statsSuffix = \sc tc -> String.fromInt sc ++ " stav" ++ (if sc == 1 then "" else "y") ++ "  ·  " ++ String.fromInt tc ++ " prechod" ++ (if tc == 1 then "" else "y")
            , settingsTitle = "Nastavenia"
            , settingsLanguage = "Jazyk"
            , settingsAutoReorder = "Automatické prečíslovanie stavov pri vymazaní"
            , settingsAutoReorderDesc = "Pri vymazaní q2 sa všetky vyššie stavy (q3, q4…) premenujú o jedna nadol."
            , diagramGenerated = "Diagram generované z kódu."
            }