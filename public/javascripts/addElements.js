const addStep = () => {
    let count =
      parseInt(document.getElementById("step").children.length) + 1;
    const container = document.getElementById("step");
    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group mb-3";

    const stepS = document.createElement("span");
    stepS.className = "input-group-text";
    stepS.textContent = `Step ${count}`;
    const newStep = document.createElement("input");
    newStep.name = "steps[]";
    newStep.type = "text";
    newStep.className = "form-control";

    const btn = document.createElement("button");
    btn.className = "btn btn-outline-secondary remove";
    btn.type = "button";
    btn.textContent = "-";

    btn.addEventListener("click", function (e) {
      e.currentTarget.parentNode.remove();
    });

    // step.append(newStep)
    inputGroup.append(stepS);
    inputGroup.append(newStep);
    inputGroup.append(btn);
    container.append(inputGroup);
  };
  const addIng = () => {
    let count =
      parseInt(document.getElementById("ing").children.length) + 1;
    const container = document.getElementById("ing");
    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group mb-3";

    const quantS = document.createElement("span");
    quantS.className = "input-group-text";
    quantS.textContent = "Quantity";
    const newQuant = document.createElement("input");
    newQuant.type = "text";
    newQuant.className = "form-control";
    newQuant.name = `ingredients[${count}][quantity]`;

    const nameS = document.createElement("span");
    nameS.className = "input-group-text";
    nameS.textContent = "Ingredient";
    const newName = document.createElement("input");
    newName.type = "text";
    newName.className = "form-control";
    newName.name = `ingredients[${count}][name]`;

    const typeS = document.createElement("span");
    typeS.className = "input-group-text";
    typeS.textContent = "Memo";
    const newType = document.createElement("input");
    newType.type = "text";
    newType.className = "form-control";
    newType.name = `ingredients[${count}][type]`;

    const btn = document.createElement("button");
    btn.className = "btn btn-outline-secondary";
    btn.type = "button";
    btn.textContent = "-";

    btn.addEventListener("click", function (e) {
      e.currentTarget.parentNode.remove();
    });

    inputGroup.append(quantS);
    inputGroup.append(newQuant);
    inputGroup.append(nameS);
    inputGroup.append(newName);
    inputGroup.append(typeS);
    inputGroup.append(newType);
    inputGroup.append(btn);
    container.append(inputGroup);
  };