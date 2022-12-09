export function countTimeSpentOnFunction(functionToTest, functionArgs, functionName) {
  let functionResult;
  const getArgNameAndBaseValue = /(?<=\()(.*?)(?=\))/;
  const getArgBaseValue = /([ ][=][ =])\d+/;

  const functionArgsToPass = functionArgs || [];
  const functionNameOnTimer = functionName || functionToTest.name;

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
  //   return `${arg}: ${functionArgsValues[index]}`
  // });

  // assign the value that you want to show here or leave it blank
  const functionArgsOnTimer = functionArgsValues;

  if (functionArgs?.length) {
    console.time(`Time to run the function: ${functionNameOnTimer}(${functionArgsOnTimer})`)
    functionResult = functionToTest(...functionArgsToPass);
    console.timeEnd(`Time to run the function: ${functionNameOnTimer}(${functionArgsOnTimer})`)
  } else {
    console.time(`Time to run the function: ${functionNameOnTimer}()`)
    functionResult = functionToTest();
    console.timeEnd(`Time to run the function: ${functionNameOnTimer}()`)
  }

  return functionResult;
}
