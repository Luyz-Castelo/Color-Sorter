export function countTimeSpentOnFunction(functionToTest, functionArgs, functionName) {
  let functionResult;
  let functionArgsOnTimer;

  const getArgNameAndBaseValue = /(?<=\()(.*?)(?=\))/;
  const getArgBaseValue = /([ ][=][ =])\d+/;

  const functionArgsToPass = functionArgs || [];
  const functionNameOnTimer = functionName || functionToTest.name;
  
  /* add .join(', ') to this variable if you want to use it on the console.time and console.timeEnd
  to show only the values used for the function */
  const functionArgsValues = functionArgsToPass.map(arg => {
    if (arg.nodeName) return JSON.stringify(arg, ['tagName', 'className']);
    return JSON.stringify(arg);
  });
  
  /* use this variable if you want to print the args names and base values on the console.time and console.timeEnd statements */
  // const functionArgsNamesAndBaseValues = functionToTest.toString().match(getArgNameAndBaseValue)[0];

  /* add .join(', ') to this variable if you want to use it on the console.time and console.timeEnd
  to show only the names of the args used by the function */
  // const functionArgsNamesWithoutBaseValues = functionArgsNamesAndBaseValues.split(', ').map(arg => {
  //   return arg.match(getArgBaseValue) ? arg.replace(arg.match(getArgBaseValue)[0], '') : arg;
  // });

  /* use this variable if you want to print the args names and values used on the console.time and console.timeEnd statements */
  // const functionArgsNamesAndValuesUsed = functionArgsNamesWithoutBaseValues.map((arg, index) => {
  //   return `${arg}: ${functionArgsValues[ifunctionArgsNamesWithoutBaseValuesndex]}`
  // });

  // assign the value that you want to use on the time and timeEnd statements here or leave it blank
  functionArgsOnTimer = functionArgsValues;

  debugger

  if (functionArgs?.length) {
    console.time(`Time to run the function: ${functionNameOnTimer}(${functionArgsOnTimer})`);
    functionResult = functionToTest(...functionArgsToPass);
    console.timeEnd(`Time to run the function: ${functionNameOnTimer}(${functionArgsOnTimer})`);
  } else {
    console.time(`Time to run the function: ${functionNameOnTimer}()`);
    functionResult = functionToTest();
    console.timeEnd(`Time to run the function: ${functionNameOnTimer}()`);
  }

  return functionResult;
}