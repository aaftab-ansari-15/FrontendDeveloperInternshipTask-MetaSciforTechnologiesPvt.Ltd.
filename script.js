const inputBox = document.getElementById('inputBox');
const listContainer = document.getElementById('listContainer');

printToDoTask();
// window.addEventListener('storage', printToDoTask());
function printToDoTask(){
    if(localStorage.getItem("allTaskData") === null) {
        localStorage.setItem("allTaskData", []);
        listContainer.innerHTML = ``;
    }
    else{
        let allTaskDataString = localStorage.getItem("allTaskData");
        const allTaskDataArr = JSON.parse(allTaskDataString);
        let html = ``;
        allTaskDataArr.forEach( taskData => {
            let checkedValue = taskData.taskChecked;
            html += `<li draggable="true" id="li${taskData.taskId}" 
            class="list-group-item border border-white d-flex justify-content-between align-items-center">
            <input ${checkedValue ? 'checked' : ''} id="task${taskData.taskId}" onClick="changeTaskStatus(${taskData.taskId})" 
            class="m-3" type="radio">
            ${checkedValue ? '<del class="opacity-50">' : ''}${taskData.taskName}${checkedValue ? '</del>' : ''}
            <div class="d-flex justify-content-end">
                <button class="w-100 p-2 bg-success rounded border border-white text-white" 
                onclick="editToDoTask(${taskData.taskId})">Edit</button>
                <button class="w-100 p-2 bg-danger rounded border border-white text-white" 
                onclick="deleteToDoTask(${taskData.taskId})">Delete</button>
            </div></li>`;
        });
        listContainer.innerHTML = html;
    }    
}

function addToDoTask(){
    
    if (inputBox.value == ''){
        console.log('abc');
        alert("you must add some name.");
    }
    else{
        let allTaskDataString = localStorage.getItem("allTaskData");
        if (allTaskDataString.length > 5) {
            const allTaskDataArr = JSON.parse(allTaskDataString);
            let lastTaskId =allTaskDataArr[allTaskDataArr.length-1].taskId;
            let newTaskData = {taskId: (lastTaskId+1), taskName:inputBox.value, taskChecked: false}
            allTaskDataArr.push(newTaskData);
            allTaskDataString = JSON.stringify(allTaskDataArr);
            localStorage.setItem("allTaskData", allTaskDataString);
        }
        else{
            let firstTaskData = [{taskId: 0, taskName:inputBox.value, taskChecked: false}]
            const firstTaskDataString = JSON.stringify(firstTaskData);
            localStorage.setItem("allTaskData", firstTaskDataString);
        }
        
    }
    inputBox.value = '';
    printToDoTask();

}
function changeTaskStatus(taskId){
    console.log('changeTaskStatus', taskId);
    let allTaskDataString = localStorage.getItem("allTaskData");
    let allTaskDataArr = JSON.parse(allTaskDataString);
    allTaskDataArr.forEach(taskData => {
        if (taskData.taskId ==taskId){
            console.log(taskData.taskChecked);
            taskData.taskChecked = !taskData.taskChecked;
            console.log(taskData.taskChecked);
        }
    }); 
    allTaskDataString = JSON.stringify(allTaskDataArr);
    localStorage.setItem("allTaskData", allTaskDataString);
    printToDoTask();
}
function editToDoTask(taskId){
 
    let allTaskDataString = localStorage.getItem("allTaskData");
    let allTaskDataArr = JSON.parse(allTaskDataString);
    const taskNewName = prompt('Enter new name:');
    if (taskNewName !== null && taskNewName.trim() !== ''){
        allTaskDataArr.forEach(taskData => {
            if (taskData.taskId ==taskId){
                taskData.taskName = taskNewName;
            }
        });   
    }
    allTaskDataString = JSON.stringify(allTaskDataArr);
    localStorage.setItem("allTaskData", allTaskDataString);
    printToDoTask();
}

function deleteToDoTask(taskId){
    let allTaskDataString = localStorage.getItem("allTaskData");
    let allTaskDataArr = JSON.parse(allTaskDataString);
    allTaskDataArr = allTaskDataArr.filter(taskData => taskData.taskId !== taskId);
    allTaskDataString = JSON.stringify(allTaskDataArr);
    localStorage.setItem("allTaskData", allTaskDataString);
    printToDoTask();
}

function deleteAllTask(){
    localStorage.removeItem('allTaskData');
    printToDoTask();
}


var dragSrcEl = null;
function handleDragStart(e) {
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);

  this.classList.add('dragElem');
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); 
  }
  this.classList.add('over');

  e.dataTransfer.dropEffect = 'move'; 

  return false;
}
function handleDragEnter(e) {
}
function handleDragLeave(e) {
  this.classList.remove('over');  
}
function handleDrop(e) {

  if (e.stopPropagation) {
    e.stopPropagation(); 
  }
  if (dragSrcEl != this) {
    this.parentNode.removeChild(dragSrcEl);
    var dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin',dropHTML);
    var dropElem = this.previousSibling;
    addDnDHandlers(dropElem);
    
  }
  this.classList.remove('over');
  return false;
}
function handleDragEnd(e) {
  this.classList.remove('over');

 
}
function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);

}
var cols = document.querySelectorAll('#listContainer .list-group-item');
[].forEach.call(cols, addDnDHandlers);



