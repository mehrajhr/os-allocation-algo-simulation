let nextFitIndex = 0;
let originalBlocks = [];

function simulate() {
  const blocksInput = document
    .getElementById("blocks")
    .value.split(",")
    .map(Number);
  const processInput = document
    .getElementById("processes")
    .value.split(",")
    .map(Number);
  const algo = document.getElementById("algorithm").value;

  if (!algo) return alert("Please select an algorithm");

  originalBlocks = [...blocksInput];
  let blocks = [...blocksInput];
  let allocation = Array(processInput.length).fill(-1);
  let explanation = [];

  nextFitIndex = 0;

  if (algo === "first") firstFit(blocks, processInput, allocation, explanation);
  if (algo === "best") bestFit(blocks, processInput, allocation, explanation);
  if (algo === "worst") worstFit(blocks, processInput, allocation, explanation);
  if (algo === "next") nextFit(blocks, processInput, allocation, explanation);

  showExplanation(algo, explanation);
  displayProcessTable(processInput, allocation);
  displayBlockTable(blocks, allocation);
}

/* ===== Algorithms with Explanation ===== */

function firstFit(b, p, a, exp) {
  exp.push("<h3>First Fit – Working</h3>");
  p.forEach((proc, i) => {
    exp.push(`<b>P${i + 1} (${proc})</b>`);
    for (let j = 0; j < b.length; j++) {
      exp.push(`Checking Block ${j + 1} (size ${b[j]})`);
      if (b[j] >= proc) {
        a[i] = j;
        b[j] -= proc;
        exp.push(`✔ Allocated to Block ${j + 1}, Remaining = ${b[j]}`);
        return;
      }
    }
    exp.push("✖ Not Allocated (No sufficient block)");
  });
}

function bestFit(b, p, a, exp) {
  exp.push("<h3>Best Fit – Working</h3>");
  p.forEach((proc, i) => {
    let best = -1;
    exp.push(`<b>P${i + 1} (${proc})</b>`);
    for (let j = 0; j < b.length; j++) {
      if (b[j] >= proc) {
        exp.push(`Block ${j + 1} fits (size ${b[j]})`);
        if (best === -1 || b[j] < b[best]) best = j;
      }
    }
    if (best !== -1) {
      a[i] = best;
      b[best] -= proc;
      exp.push(`✔ Best Fit = Block ${best + 1}, Remaining = ${b[best]}`);
    } else exp.push("✖ Not Allocated");
  });
}

function worstFit(b, p, a, exp) {
  exp.push("<h3>Worst Fit – Working</h3>");
  p.forEach((proc, i) => {
    let worst = -1;
    exp.push(`<b>P${i + 1} (${proc})</b>`);
    for (let j = 0; j < b.length; j++) {
      if (b[j] >= proc) {
        exp.push(`Block ${j + 1} fits (size ${b[j]})`);
        if (worst === -1 || b[j] > b[worst]) worst = j;
      }
    }
    if (worst !== -1) {
      a[i] = worst;
      b[worst] -= proc;
      exp.push(`✔ Worst Fit = Block ${worst + 1}, Remaining = ${b[worst]}`);
    } else exp.push("✖ Not Allocated");
  });
}

function nextFit(b, p, a, exp) {
  exp.push("<h3>Next Fit Working</h3>");
  let n = b.length;
  p.forEach((proc, i) => {
    let count = 0;
    exp.push(`<b>P${i + 1} (${proc})</b>`);
    while (count < n) {
      exp.push(`Checking Block ${nextFitIndex + 1}`);
      if (b[nextFitIndex] >= proc) {
        a[i] = nextFitIndex;
        b[nextFitIndex] -= proc;
        exp.push(
          `✔ Allocated to Block ${nextFitIndex + 1}, Remaining = ${b[nextFitIndex]}`,
        );
        nextFitIndex = (nextFitIndex + 1) % n;
        return;
      }
      nextFitIndex = (nextFitIndex + 1) % n;
      count++;
    }
    exp.push("✖ Not Allocated");
  });
}

/* ===== Explanation Display ===== */

function showExplanation(algo, exp) {
  const left = document.getElementById("algoLeft");
  const right = document.getElementById("algoRight");

  left.style.display = "none";
  right.style.display = "none";

  const box = algo === "first" || algo === "worst" ? left : right;
  box.innerHTML = exp.join("<hr>");
  box.style.display = "block";
}

/* ===== Tables ===== */

function displayProcessTable(p, a) {
  let html = `<table><tr><th>Process</th><th>Size</th><th>Block</th></tr>`;
  p.forEach((x, i) => {
    html += `<tr><td>P${i + 1}</td><td>${x}</td>
        <td class="${a[i] == -1 ? "not-allocated" : "allocated"}">
        ${a[i] == -1 ? "Not Allocated" : "Block " + (a[i] + 1)}</td></tr>`;
  });
  html += "</table>";
  document.getElementById("result").innerHTML = html;
}

function displayBlockTable(b, a) {
  let html = `<div class="block-title">Memory Block Status</div><table>
    <tr><th>Block</th><th>Initial</th><th>Remaining</th><th>Processes</th></tr>`;
  originalBlocks.forEach((x, i) => {
    let list = [];
    a.forEach((blk, p) => {
      if (blk === i) list.push("P" + (p + 1));
    });
    html += `<tr><td>Block ${i + 1}</td><td>${x}</td><td>${b[i]}</td><td>${list.join(", ") || "-"}</td></tr>`;
  });
  html += "</table>";
  document.getElementById("blockStatus").innerHTML = html;
}

function resetAll() {
  document.getElementById("blocks").value = "";
  document.getElementById("processes").value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("blockStatus").innerHTML = "";
  document.getElementById("algoLeft").style.display = "none";
  document.getElementById("algoRight").style.display = "none";
  nextFitIndex = 0;
}
