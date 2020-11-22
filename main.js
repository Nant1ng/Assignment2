//Elements
const saldoEl = document.querySelector(".saldo .value");
const totalInkomstEl = document.querySelector(".total-inkomst");
const totalKostnadEl = document.querySelector(".total-kostnad");
const inkomstEl = document.querySelector("#inkomst");
const kostnadEl = document.querySelector("#kostnad");
const allEl = document.querySelector("#all");
const inkomstList = document.querySelector("#inkomst .list");
const kostnadList = document.querySelector("#kostnad .list");
const allList = document.querySelector("#all .list");

//Buttons
const inkomstBtn = document.querySelector(".tab1");
const kostnadBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

//Inputs
const addInkomst = document.querySelector(".add-inkomst");
const inkomstTitle = document.getElementById("inkomst-title-input");
const inkomstBelopp = document.getElementById("inkomst-belopp-input");
const addKostnad = document.querySelector(".add-kostnad");
const kostnadTitle = document.getElementById("kostnad-title-input");
const kostnadBelopp = document.getElementById("kostnad-belopp-input");

//Variabeler
let LIST = []
let saldo = 0, inkomst = 0, kostnad = 0;
const DELETE = "delete", EDIT = "edit";

//Event listener 
inkomstBtn.addEventListener("click", function(){
    show(inkomstEl);
    hide([kostnadEl, allEl]);
    active(inkomstBtn);
    inactive([kostnadBtn, allBtn]);
})
kostnadBtn.addEventListener("click", function(){
    show(kostnadEl);
    hide([inkomstEl, allEl]);
    active(kostnadBtn);
    inactive([inkomstBtn, allBtn]);
})
allBtn.addEventListener("click", function(){
    show(allEl);
    hide([inkomstEl, kostnadEl]);
    active(allBtn);
    inactive([inkomstBtn, kostnadBtn]);
})
addInkomst.addEventListener("click", function(){
    if(!inkomstTitle.value || !inkomstBelopp.value) return;
    //Spara i LIST
    let inkomst = {
        type : "inkomst" ,
        title : inkomstTitle.value ,
        belopp : parseInt(inkomstBelopp.value)
    }
    LIST.push(inkomst);

    updateUI();
    clearInput([inkomstTitle, inkomstBelopp])
})
addKostnad.addEventListener("click", function(){
    if(!kostnadTitle.value || !kostnadBelopp.value) return;
    //Spara i LIST
    let kostnad = {
        type : "kostnad" ,
        title : kostnadTitle.value ,
        belopp : parseInt(kostnadBelopp.value)
    }
    LIST.push(kostnad);

    updateUI();
    clearInput([kostnadTitle, kostnadBelopp])
})
//Delet och Edit 
allList.addEventListener("click", deleteOrEdit);
inkomstList.addEventListener("click", deleteOrEdit);
kostnadList.addEventListener("click", deleteOrEdit);

//Funktioner 
function deleteOrEdit(event){
    const targetBtn = event.target;
    const entry = targetBtn.parentNode;
    
    if(targetBtn.id == DELETE){
        deleteEntry(entry);
    }else if(targetBtn.id == EDIT){
        editEntry(entry);
    }
}
function deleteEntry(entry){
    LIST.splice(entry.id, 1);

    updateUI();
}
function editEntry(entry){
    let ENTRY = LIST[entry.id];
    if(ENTRY.type == "inkomst"){
        inkomstBelopp.value = ENTRY.belopp;
        inkomstTitle.value = ENTRY.title;
    }else if(ENTRY.type == "kostnad"){
        kostnadBelopp.value = ENTRY.belopp;
        kostnadTitle.value = ENTRY.title;
    }
    deleteEntry(entry)

}
function updateUI(){
    inkomst = calculateTotal("inkomst", LIST);
    kostnad = calculateTotal("kostnad", LIST);
    saldo = Math.abs(calculateSaldo(inkomst, kostnad));

//Bestämer tecken på saldo om det är minus lr ej 
    let tecken = (inkomst >= kostnad) ? "" : "-" ;
    
    //Uppdatera UI 
    saldoEl.innerHTML = `${tecken}${saldo}$`;
    totalInkomstEl.innerHTML = `${inkomst}$`;
    totalKostnadEl.innerHTML = `-${kostnad}$`;

    clearElement([inkomstList, kostnadList, allList]);

    

    LIST.forEach( (entry, index) => {
        if(entry.type == "inkomst"){
            showEntry(inkomstList, entry.type, entry.title, entry.belopp, index)
        }else if(entry.type == "kostnad"){
            showEntry(kostnadList, entry.type, entry.title, entry.belopp, index)
        }
        showEntry(allList, entry.type, entry.title, entry.belopp, index)
    });

}

function showEntry(list, type, title, belopp, id){
    const entry = ` <li id ="${id}" class="${type}">
                    <div class="entry">${title}: ${belopp}</div>
                    <div id="edit"></div>
                    <div id="delete"></div>
                    </li>`;
    const position = "afterbegin";
    
    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach(element =>{
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){
    let summa = 0;

    list.forEach( entry => {
        if(entry.type == type){
            summa += entry.belopp;
        }
    })
    return summa;
}
function calculateSaldo(inkomst, kostnad){
    return inkomst - kostnad;
}

function clearInput(inputs){
    inputs.forEach( input => {
        input.value = "";
    })
}
//Gör så att de listorna som man inte är inne på får en grå text(gömda)
function show(element){
    element.classList.remove("hide");
}
function hide( elements){
    elements.forEach(element => {
        element.classList.add("hide");
    })
}
function active(element){
    element.classList.add("active");
}
function inactive( elements ){
    elements.forEach(element => {
        element.classList.remove("active");
    })
}