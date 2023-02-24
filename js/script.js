// Récupération des données des fichiers JSON
const programData = fetch('../data/program.json').then(response => response.json());
const materialsData = fetch('../data/materials.json').then(response => response.json());

// Récupération de l'élément HTML pour afficher les données des programmes
const programList = document.getElementById('program-list');

// Fonction pour afficher les données des programmes dans l'élément HTML
function displayPrograms(programs) {
  programList.innerHTML = '';
  programs.forEach(program => {
    const programElement = document.createElement('div');
    programElement.innerHTML = `<h3>${program.sName}</h3>`;
    const piecesList = document.createElement('ul');
    program.pieces.forEach(piece => {
      const pieceElement = document.createElement('li');
      pieceElement.innerHTML = piece.sName;
      pieceElement.addEventListener('click', () => {
        displayMaterials(piece.idMaterial);
      });
      piecesList.appendChild(pieceElement);
    });
    programElement.appendChild(piecesList);
    programList.appendChild(programElement);
  });
}

// Fonction pour afficher les données des matériaux dans une modale
function displayMaterials(idMaterial) {
  materialsData.then(materials => {
    const material = materials.find(material => material.id === idMaterial);
    console.log(material);
    const temperatureMV = material.masseVolumique[0].data[0].Temperature.map(Number);
    const temperatureCP = material.coeffPoisson[0].data[0].Temperature.map(Number);
    const densites = material.masseVolumique[0].data[1].Densite@.map(Number);
    console.log(temperatureMV);
    console.log(temperatureCP);
    const modalContent = `
      <h3>Type : ${material.name}</h3>
        <table>
            <tr>
            <th>Températures (MV)</th>
            <th>Densités</th>
            <th>Températures (CP)</th>
            <th>nuX</th>
            </tr>
            <tr>
                <td>${temperatureMV.sort(function(a, b){return a - b}).join()} (°C)</td>
                <td>${densites.sort(function(a, b){return a - b}).join()}</td>
                <td>${temperatureCP.sort(function(a, b){return a - b}).join()} (°C)</td>
                <td>${material.coeffPoisson[0].data[1].nuX.join()}</td>
            </tr>
        </table>
    `;
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    const closeModalButton = document.createElement('button');
    closeModalButton.textContent = 'Fermer';
    closeModalButton.addEventListener('click', () => {
      modal.remove();
    });
    modal.appendChild(closeModalButton);
  });
}

// Appel de la fonction pour afficher les données des programmes
programData.then(data => {
  displayPrograms(data.programs);
});
