export function nextJoin(array, obj) {
  let text = "";
  for (let i = 0; i < array?.length; i++) {
    if (array[i + 1]) text += array[i][obj] + " , ";
    else text += array[i][obj];
  }
  return text;
}
