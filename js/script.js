const setter = document.querySelector("#setter");
const setterRow = setter.querySelector("#rows");
const setterCol = setter.querySelector("#columns");
const setterMine = setter.querySelector("#mines");
const setterSubmit = setter.querySelector("#submit");
let firstShot = true;

setterSubmit.addEventListener("click", setUp);

function setUp(e){
    e.preventDefault();
    if(!setterRow.value) alert("set rows!");
    if(!setterCol.value) alert("set columns!");
    if(!setterMine.value) alert("set mines!");
    if(setterRow.value && setterCol.value && setterMine.value){
        if(!parseInt(setterRow.value) || !parseInt(setterCol.value) || !parseInt(setterMine.value)) alert("use a numbers!");
        else {
            const container = document.querySelector("#container");
            container.innerHTML = "";
            firstShot = true;
            prepareGame(setterRow.value, setterCol.value, setterMine.value);
        }
    }
}

function prepareGame(rows, columns, mines){
    const container = document.querySelector("#container");
    let frag = document.createDocumentFragment();
    for(let i = 0; i < parseInt(rows); i++){
        const row = document.createElement("div");
        row.classList.add("row");
        row.id = `row-${i+1}`
        for(let j = 0; j <parseInt(columns); j++){
            const column = document.createElement("div");
            column.dataset.marked = false;
            row.appendChild(column);
        }
        frag.appendChild(row);
    }
    container.appendChild(frag);
    const fields = document.querySelectorAll(".row div");
    fields.forEach(function(field){
        field.addEventListener("click", function(e){
            startGame(parseInt(mines), fields, e.target);
        });
    });
}

function startGame(addMines, fields, target){
    const info = document.querySelector("#info");
    if(firstShot){
        firstShot = false;
        info.textContent = "Mines: " + addMines;
        for(let k = 0; k < addMines; k++){
            let random = Math.floor((Math.random() * fields.length));
            if(fields[random] == target || fields[random].dataset.mine){
                k--;
            } else {
                fields[random].dataset.mine = true;
            }
        }

        const rows = document.querySelectorAll(".row");
        const mines = document.querySelectorAll("[data-mine]");
        let notMines = document.querySelectorAll(".row div:not([data-mine])").length;
        const fieldsArr = [];
        for(let i = 0; i < rows.length; i++){
            const row = document.querySelectorAll(`#row-${i+1} div`);
            row.forEach(function(field){
                field.addEventListener("click", checkField);
                field.addEventListener("contextmenu", markField);
            });
            fieldsArr.push(row)
        }

        function checkField(e){
            let counter = 0;
            fieldsArr.forEach(function(row, indexRow){
                row.forEach(function(field, indexField){
                    if(field == e.target){
                        if(row[indexField -1] && row[indexField -1].dataset.mine) counter++;
                        if(row[indexField +1] && row[indexField +1].dataset.mine) counter++;
                        if(fieldsArr[indexRow -1] && fieldsArr[indexRow -1][indexField] && fieldsArr[indexRow -1][indexField].dataset.mine) counter++;
                        if(fieldsArr[indexRow -1] && fieldsArr[indexRow -1][indexField -1] && fieldsArr[indexRow -1][indexField -1].dataset.mine) counter++;
                        if(fieldsArr[indexRow -1] && fieldsArr[indexRow -1][indexField +1] && fieldsArr[indexRow -1][indexField +1].dataset.mine) counter++;
                        if(fieldsArr[indexRow +1] && fieldsArr[indexRow +1][indexField] && fieldsArr[indexRow +1][indexField].dataset.mine) counter++;
                        if(fieldsArr[indexRow +1] && fieldsArr[indexRow +1][indexField -1] && fieldsArr[indexRow +1][indexField -1].dataset.mine) counter++;
                        if(fieldsArr[indexRow +1] && fieldsArr[indexRow +1][indexField +1] && fieldsArr[indexRow +1][indexField +1].dataset.mine) counter++;
                        if(field.dataset.mine){
                            mines.forEach(function(mine){
                                mine.classList.add("red");
                            });
                            fieldsArr.forEach(function(row){
                                row.forEach(function(field){
                                    field.removeEventListener("click", checkField);
                                });
                            });
                            counter = "X";
                            alert("you lose!");
                        };
                    }
                })
            });
            e.target.textContent = counter;
            e.target.classList.add("opened");
            e.target.removeEventListener("click", checkField);
            notMines--;
            if(!notMines){
                mines.forEach(function(mine){
                    mine.classList.add("green");
                });
                fieldsArr.forEach(function(row){
                    row.forEach(function(field){
                        field.removeEventListener("click", checkField);
                    })
                });
                alert("you win!");
            };
            if(counter === 0){
                fieldsArr.forEach(function(row, indexRow){
                    row.forEach(function(field, indexField){
                        if(field == e.target){
                        if(row[indexField -1]) row[indexField -1].click();
                        if(row[indexField +1]) row[indexField +1].click();
                        if(fieldsArr[indexRow -1] && fieldsArr[indexRow -1][indexField]) fieldsArr[indexRow -1][indexField].click();
                        if(fieldsArr[indexRow -1] && fieldsArr[indexRow -1][indexField -1]) fieldsArr[indexRow -1][indexField -1].click();
                        if(fieldsArr[indexRow -1] && fieldsArr[indexRow -1][indexField +1]) fieldsArr[indexRow -1][indexField +1].click();
                        if(fieldsArr[indexRow +1] && fieldsArr[indexRow +1][indexField]) fieldsArr[indexRow +1][indexField].click();
                        if(fieldsArr[indexRow +1] && fieldsArr[indexRow +1][indexField -1]) fieldsArr[indexRow +1][indexField -1].click();
                        if(fieldsArr[indexRow +1] && fieldsArr[indexRow +1][indexField +1]) fieldsArr[indexRow +1][indexField +1].click();
                        }
                    })
                });
            }
        }

        function markField(e){
            e.preventDefault();
            if(!e.target.textContent && e.target.dataset.marked === "false"){
                e.target.removeEventListener("click", checkField);
                e.target.classList.add("green");
                e.target.dataset.marked = true;
                addMines--;
                info.textContent = "Mines: " + addMines;
            } else if(!e.target.textContent && e.target.dataset.marked === "true"){
                e.target.addEventListener("click", checkField);
                e.target.classList.remove("green");
                e.target.dataset.marked = false;
                addMines++;
                info.textContent = "Mines: " + addMines;
            }
        }

        target.click();
    }
}