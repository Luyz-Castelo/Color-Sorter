import { getHashFromString } from "../getHashFromString.js";

export class TimeSpentOnFunction {
  constructor(timeSpentOnFunction, functionDisplayName) { 
    this.totalTimeSpentOnFunction = timeSpentOnFunction;
    this.functionDisplayName = functionDisplayName;
    this.hashedDisplayName = getHashFromString(functionDisplayName);
    this.quantityOfTimesItWasCalled = 1
  }
}