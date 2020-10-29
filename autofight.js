// ==UserScript==
// @name         Evolve-AutoFightScript
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  AutoFight Script for Idle game Evolve.
// @author       zqzhang1996
// @match        https://tmvictor.github.io/Evolve-Scripting-Edition/
// @match        https://wdjwxh.github.io/Evolve-Scripting-Edition/
// @match        https://wdjwxh.gitee.io/evolve-scripting-edition/
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// ==/UserScript==

(function () {
    document.getElementById('c_garrison').getElementsByClassName('header')[0].innerHTML += '<button id="is_autofight" value="true" style="height: 1.5rem;">启用自动战斗</button>';
    document.getElementById('is_autofight').onclick = function () {                          //绑定点击事件
        this.value = !(this.value === "true")
        if(this.value === "true"){
            this.innerHTML = "启用自动战斗";
        }
        else{
            this.innerHTML = "关闭自动战斗";
        }
    };
    setInterval(autoFight, 1000);
})();
function autoFight() {
    // 检测是否启用
    if(!(document.getElementById('is_autofight').value === "true")) return;
    // 金钱大于总量一半且雇佣费用无系数时，招募雇佣兵
    if(evolve.global.resource.Money.amount > evolve.global.resource.Money.max * 0.5 && evolve.global.civic.garrison.m_use == 0){
        evolve.document.getElementById("garrison").__vue__.hire();
    }
    let army = evolve.armyRating(evolve.global.civic.garrison.max, "army", '0') * (evolve.global.race['puny'] ? 3 : 5) / 10;
    let enemy = 0;
    let tactic = 0;
    for (tactic = 3; tactic >= 0; tactic--) {
        let gov = 0;
        for (gov = 2; gov >= 0; gov--) {
            // 不对军事力量大于50的周边国家发动围城
            if(evolve.global.civic.foreign[`gov${gov}`].occ && evolve.global.civic.foreign[`gov${gov}`].mil > 50) continue;
            // 不进攻军事力量大于100的周边国家
            if(evolve.global.civic.foreign[`gov${gov}`].mil > 100) continue;
            switch (tactic) {
                case 0:
                    enemy = 10;
                    break;
                case 1:
                    enemy = 50;
                    break;
                case 2:
                    enemy = 100;
                    break;
                case 3:
                    enemy = 200;
                    break;
                case 4:
                    enemy = 500;
                    break;
            }
            enemy = Math.floor(enemy * evolve.global.civic.foreign[`gov${gov}`].mil / 100);
            // console.log("army:" + army + " enemy:" + enemy + " tactic:" + tactic + " gov:" + gov)
            if (army > enemy) {
                let raid = evolve.global.civic.garrison.workers - evolve.global.civic.garrison.wounded
                for (; raid > 0; raid--) {
                    // console.log("raid:" + raid + " army:" + evolve.armyRating(raid, "army", '0') + " enemy:" + enemy + " tactic:" + tactic + " gov:" + gov)
                    if (evolve.armyRating(raid, "army", '0') * (evolve.global.race['puny'] ? 3 : 5) / 10 >= enemy && evolve.armyRating(raid - 1, "army", '0') * (evolve.global.race['puny'] ? 3 : 5) / 10 <= enemy) {
                        evolve.global.civic.garrison.tactic = tactic;
                        evolve.global.civic.garrison.raid = raid;
                        evolve.document.getElementById("garrison").__vue__.campaign(gov);
                        return;
                    }
                }
                return;
            }
        }
    }
}
