export function countTimeSpentOnFunction(functionToTest, functionArgs, functionName) {
  let functionResult;
  let functionArgsOnStorage;

  const getArgNameAndBaseValue = /(?<=\()(.*?)(?=\))/;
  const getArgBaseValue = /([ ][=][ =])\d+/;

  const functionArgsToPass = functionArgs || [];
  const functionNameOnStorage = functionName || functionToTest.name;
  
  /* add .join(', ') to this variable if you want to show only the values used by this function call */
  const functionArgsValues = functionArgsToPass.map(arg => {
    if (arg.nodeName) return JSON.stringify(arg, ['tagName', 'className']);
    return JSON.stringify(arg);
  });
  
  /* use this variable if you want to show the args names and base values */
  // const functionArgsNamesAndBaseValues = functionToTest.toString().match(getArgNameAndBaseValue)[0];

  /* add .join(', ') to this variable if you want to show only the names of the args used by the function */
  // const functionArgsNamesWithoutBaseValues = functionArgsNamesAndBaseValues.split(', ').map(arg => {
  //   return arg.match(getArgBaseValue) ? arg.replace(arg.match(getArgBaseValue)[0], '') : arg;
  // });

  /* use this variable if you want to show args names and values */
  // const functionArgsNamesAndValuesUsed = functionArgsNamesWithoutBaseValues.map((arg, index) => {
  //   return `${arg}: ${functionArgsValues[ifunctionArgsNamesWithoutBaseValuesndex]}`
  // });

  // assign the value that you want to show here or leave it blank
  functionArgsOnStorage = functionArgsValues;

  let start, end;
  let timeSpentOnFunction = 0;
  
  if (functionArgs?.length) {
    start = performance.now();
    functionResult = functionToTest(...functionArgsToPass);
    end = performance.now();
  } else {
    start = performance.now();
    functionResult = functionToTest();
    end = performance.now();
  }
  
  timeSpentOnFunction += end - start;

  return { functionResult, timeSpentOnFunction };
}

