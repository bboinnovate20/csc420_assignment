

let MAIN_SCHEDULE = document.querySelector('.main-schedule-task');
const API = 'http://127.0.0.1:8000/todos/api';
window.editMode = false;
window.editId = 0;
const all = document.getElementById("all");
const completed = document.getElementById("completed");
const inProg = document.getElementById("in-progress");

const ALL_TABS = [all, inProg, completed];
const STATUSES = ["in-progress", "completed"];
let CATEGORY = [];
let ALL_TASK = []


getAllCategories("category");
getAllCategories();
inProgress(0)

// generateCategoryOptions("category", CATEGORY);






// function addToDom(e) {
    
//     let title = document.getElementById('title').value;
//     let description = document.getElementById('content').value;
//     let category = document.getElementById('category').value;


//     MAIN_SCHEDULE.innerHTML += `
//         <div class="schedule-task">
//             <div>
//                 <input id="checkbox" type="checkbox" name="" id="">
//             </div>
//             <div class="st-inner-content">
//                 <p>${title}</p>
//             </div>
//             <div class="tag" style="background-color: ${category.split(',')[2]}; color: white;">
//                 <p>${getCategory(id).title}</p>
//             </div>
//         </div>
//     `
//     document.getElementById('title').value = "";
//     document.getElementById('content').value = "";
// }



async function getCategory(id) {
    if(CATEGORY.length <= 0) {
        fetchData = await fetch(`${API}/category/${id}`);
        let category = await fetchData.json();
        
        return await category
    }
    my_cat = CATEGORY.filter((cat) => cat.id == id)[0];
    return my_cat;
}   


function navigate(number) {
    for (let index = 0; index < ALL_TABS.length; index++) {
        if(number == index) ALL_TABS[index].classList.add("active");
        else ALL_TABS[index].classList.remove("active");
    }
    if(number == 0) {
        return getFromAPI();
    }

    filterTask(number);
}

// initiateIntoDOM(ALL_TASK, MAIN_SCHEDULE);

function inProgress(inProgress) {
    switch (inProgress) {
        case 0:
            navigate(0)
            break;
        case 1:
            navigate(1)
            break;
        
        case 2:
            navigate(2)
            break;
    
        default:
            break;
    }    
}

function updateTask(element, fullUpdate) {
    if(fullUpdate) {
        fetch(`${API}/all/${element['id']}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json', 
              },
              body: JSON.stringify({
                'status': element['status'],
                'title': element['title'],
                'category': element['category'],
                'description': element['description'],
              })
        }).then(async (response) => {
            if(response.ok) {
                window.editMode = false;
                getFromAPI()
                //update the button 
                await progress_remind() 
                document.getElementById('add').innerText = "Add Task";
            }
            else alert("Failed to Updated!");
        })

        return;
    }

    
    fetch(`${API}/${element.name}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json', 
              },
              body: JSON.stringify({
                'status': element.checked ? 2 : 1
              })
    }).then((response) =>{
        if(response.ok) {
            findTask = ALL_TASK.find((e) => e.id == element.name);
            findTask.status = element.checked ? 2 : 1;  
            progress_remind() 
        }
    })
    
}



async function initiateIntoDOM(array, dom) {
    dom.innerHTML = "";
    
    array.forEach(async (element) =>  {
        let catg = await getCategory(element.category)
        
        dom.innerHTML +=`

        <div class="schedule-task">
            <div>
                <input id="checkbox" onchange="updateTask(this, false);" ${element.status == 2 ? 'checked':''} type="checkbox" name=${element.id} id="">
            </div>
            <div class="st-inner-content">
            <a href="/todos/${element.id}" style="text-decoration: none; color: #000;">
                    <p>${element.title}</p>
                    </a>
                </div>
            <div class="tag" style="background-color:${catg.color}; color: white;">
                <p>${catg.title}</p>
            </div>
            <div class="edit_button">
                <button onclick=editTask(${element.id})>E</button>
                <button onclick=deleteTask(${element.id})>D</button>
            </div>
        </div>
        `
    });
}


function deleteTask(id) {
    fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json', 
          },
    }).then(async (response) => {
        if(response.ok) {
            await getFromAPI()
            return;
        } 
        alert("Not Deleted!")
    });
}

function editTask(id) {
    const toEdit = ALL_TASK.filter((task) =>task.id == id);
    window.editMode = true;
    window.editId = id;
    document.getElementById('category').value = toEdit[0].category;
    document.getElementById('title').value = toEdit[0].title;
    document.getElementById('content').value = toEdit[0].description;

    //update the button 
    document.getElementById('add').innerText = "Update Task";
    
}

function addToList() {
    let CATG = document.getElementById('category').value;
    let TITLE = document.getElementById('title').value;
    let DESCRIPTION = document.getElementById('content').value;

    data = {
        "title": TITLE,
        "description": DESCRIPTION,
        "category": CATG,
        "status": 1
    }



    if(window.editMode) {
        const toEdit = ALL_TASK.filter((task) =>task.id == window.editId);
        data["id"] = toEdit[0].id
        data["status"] = toEdit[0].status; 
        updateTask(data, true);
    }
   else {
       fetch(API, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json', 
             },
           body: JSON.stringify(data)
       }).then(async (response) => {
            
           if(response.ok) {
               await getFromAPI()
               progress_remind()
               document.getElementById('add').innerText = "Add Task";
               document.getElementById('add').disabled = false;
               return
           } 
       });
   }
   
    //empty the task inputs
    
    document.getElementById('title').value = "";
    document.getElementById('content').value = "";
}

function filterTask(by) {
    filtered = ALL_TASK.filter(task => task.status == by);
    if(filtered.length <= 0) return MAIN_SCHEDULE.innerHTML = "<p><em>Empty List</em></p>"
    initiateIntoDOM(filtered, MAIN_SCHEDULE)
}


function addToComplete() {
    
}

//initiate in the beginning;



async function getFromAPI() {
    fetchData = await fetch(API);
    data = await fetchData.json();
    ALL_TASK = [...data];
    await initiateIntoDOM(ALL_TASK, MAIN_SCHEDULE);
}


async function getAllCategories(parentNode) {
    fetchData = await fetch(`${API}/category`);
    
    data = await fetchData.json();
    CATEGORY = [...data];
    parent = document.getElementById(parentNode);

    

    CATEGORY.forEach((category) => {
        if(parent != null)
            parent.innerHTML += `<option value="${category.id}">${category.title}</option>`;
    })
    
}


async function progress_remind() {
    const getId = document.getElementById('progress_bar');

    fetchData = await fetch(API);
    data = await fetchData.json();
    myData = [...data];
   
    let allTask = myData.length;
    let filtered = myData.filter(task => task.status == 2)
    // let uncompleted = myData.length

    const percentage =  Math.floor(filtered.length/allTask * 100)
    
    getId.innerHTML = `
        <div class="progressing" style="width: ${percentage}%;">
            <div class="anim_prog"></div>
        </div>
        <p>Overall Goal ${percentage}%</p>
    `
}

progress_remind();