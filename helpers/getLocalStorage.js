export async function getLocalStorage() {
  const valueInStorage = JSON.stringify(localStorage.getItem('timeSpentOnFunctions'));
  await navigator.clipboard.writeText(valueInStorage);

  alert('JSON of time spent copied to clipboard')

  return valueInStorage;
}