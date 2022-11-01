export function countFunctionTime(functionName, functionToTest, functionArgs) {
  console.time(`countFunctionTime ${functionName}`)
  functionToTest(...functionArgs)
  console.timeEnd(`countFunctionTime ${functionName}`)
}