const Diff = require("diff");

const oldText = "The brown.";
const newText = "The b123rown.";

const diff = Diff.diffWords(oldText, newText);

let positionInNewText = 0; // Track position in the new text
let positionInOldText = 0; // Track position in the original text

console.log(diff);
diff.forEach((part) => {
  if (part.added) {
    console.log(
      `Added: '${part.value}' at position ${positionInNewText} in the new text`,
    );
    positionInNewText += part.value.length; // Update position in new text
  } else if (part.removed) {
    console.log(
      `Removed: '${part.value}' at position ${positionInOldText} in the old text`,
    );
    positionInOldText += part.value.length; // Update position in original text
  } else {
    // For unchanged parts, update both positions
    positionInNewText += part.value.length;
    positionInOldText += part.value.length;
  }
});
