export function setLocalStorage(functionName, timeSpentOnFunc) {
  const valueInStorage = JSON.parse(localStorage.getItem('timeSpentOnFunctions'));
  const functionTimerValueAlreadyInStorage = JSON.parse(localStorage.getItem('timeSpentOnFunctions'))[functionName];

  const temp = {};
  if(!functionTimerValueAlreadyInStorage) {
    temp[functionName] = {
      'quantityOfTimesTheFunctionWasCalled': 1,
      'totalTimeSpent': timeSpentOnFunc,
    }
  } else {
    temp[functionName] = {
      'quantityOfTimesTheFunctionWasCalled': Number(functionTimerValueAlreadyInStorage.quantityOfTimesTheFunctionWasCalled) + 1,
      'totalTimeSpent': Number(functionTimerValueAlreadyInStorage.totalTimeSpent) + timeSpentOnFunc,
    }
  }

  const objectToSet = {...valueInStorage, ...temp}
  
  localStorage.setItem('timeSpentOnFunctions', JSON.stringify(objectToSet));
}
