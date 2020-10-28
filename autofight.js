// ==UserScript==
// @name         Evolve-AutoFightScript
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  AutoFight Script for Idle game Evolve.
// @author       zqzhang1996
// @match        https://tmvictor.github.io/Evolve-Scripting-Edition/
// @match        https://wdjwxh.github.io/Evolve-Scripting-Edition/
// @match        https://wdjwxh.gitee.io/evolve-scripting-edition/
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// ==/UserScript==

(function() {
    setInterval(autoFight, 1000);
})();

function autoFight() {
    let army = evolve.armyRating(evolve.global.civic.garrison.max, "army");
    let enemy = 0;
    let tactic = 0
    for(tactic = 4; tactic >= 0; tactic--){
        var gov = 0;
        for(gov = 2; gov >= 0; gov--){
            switch (tactic) {
                case 0:
                    enemy = 5;
                    break;
                case 1:
                    enemy = 27.5;
                    break;
                case 2:
                    enemy = 62.5;
                    break;
                case 3:
                    enemy = 125;
                    break;
                case 4:
                    enemy = 300;
                    break;
            }
            enemy *= evolve.global.civic.foreign[`gov${gov}`].mil / 100;
            // console.log("army:" + army + " enemy:" + enemy + " tactic:" + tactic + " gov:" + gov)
            if(army >= enemy * 2){
                let raid = evolve.global.civic.garrison.workers - evolve.global.civic.garrison.wounded
                for(; raid > 0; raid--){
                    // console.log("raid:" + raid + " army:" + evolve.armyRating(raid, "army") + " enemy:" + enemy + " tactic:" + tactic + " gov:" + gov)
                    if(evolve.armyRating(raid, "army") >= enemy * 2 && evolve.armyRating(raid - 1, "army") <= enemy * 2){
                        evolve.global.civic.garrison.tactic = tactic;
                        evolve.global.civic.garrison.raid = raid;
                        evolve.document.getElementById("garrison").__vue__.campaign(0);
                        return;
                    }
                }
                return;
            }
        }
    }
}