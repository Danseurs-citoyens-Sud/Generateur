document.addEventListener("DOMContentLoaded", () => {
  // Éléments du DOM - Login
  const loginPage = document.getElementById("loginPage");
  const mainPage = document.getElementById("mainPage");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");
  const logoutBtn = document.getElementById("logoutBtn");
  const userDisplay = document.getElementById("userDisplay");
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  // Éléments du DOM - Navbar
  const navbarItems = document.querySelectorAll(".navbar-item");

  // Éléments du DOM - Générateur de contrats
  const contractForm = document.getElementById("contractForm");
  const contractType = document.getElementById("contractType");
  const cddFields = document.getElementById("cdd-fields");
  const prestationFields = document.getElementById("prestation-fields");
  const missionFields = document.getElementById("mission-fields");
  const commonFields = document.getElementById("common-fields");
  const commonFields2 = document.getElementById("common-fields-2");
  const previewBtn = document.getElementById("previewBtn");
  const generateWordBtn = document.getElementById("generateWordBtn"); // Renommé pour Word
  const addTaskBtn = document.getElementById("addTask");
  const tasksContainer = document.getElementById("tasksContainer");
  const contractPreview = document.getElementById("contract");
  const pdfContainer = document.getElementById("pdfContainer");
  const loadingOverlay = document.getElementById("loadingOverlay");

  // Éléments du DOM - Ordre de mission
  const addPersonBtn = document.getElementById("addPerson");
  const missionPersonsContainer = document.getElementById(
    "missionPersonsContainer"
  );

  // Logo DCS
  const dcsLogo =
    "https://res.cloudinary.com/dxftqgx5t/image/upload/v1746114326/DCS_logo_long_3_x09pwy.png";

  // Utilisateurs (normalement, cela serait stocké sur un serveur)
  const users = [
    { username: "Anis", password: "anis@123dcs", displayName: "Bonjour Anis" },
    { username: "user", password: "user123", displayName: "Utilisateur" },
  ];

  // Initialiser les écouteurs d'événements pour les champs de formulaire
  initFormListeners();
  initMissionListeners();

  // Vérifier si l'utilisateur est déjà connecté
  function checkLoggedIn() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      showMainPage(user.displayName);
    }
  }

  // Afficher la page principale
  function showMainPage(displayName) {
    loginPage.style.display = "none";
    mainPage.style.display = "block";
    userDisplay.textContent = `${displayName}`;

    // Initialiser la date du jour pour les champs de date
    setDefaultDates();
  }

  // Définir les dates par défaut
  function setDefaultDates() {
    const today = new Date().toISOString().split("T")[0];

    // Date de signature par défaut = aujourd'hui
    if (document.getElementById("signatureDate")) {
      document.getElementById("signatureDate").value = today;
    }

    // Dates pour CDD
    if (document.getElementById("startDate")) {
      // Date de début par défaut = aujourd'hui
      document.getElementById("startDate").value = today;

      // Date de fin par défaut = aujourd'hui + 6 mois
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      document.getElementById("endDate").value = sixMonthsLater
        .toISOString()
        .split("T")[0];
    }

    // Dates pour prestation
    if (document.getElementById("prestationStartDate")) {
      document.getElementById("prestationStartDate").value = today;

      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      document.getElementById("prestationEndDate").value = threeMonthsLater
        .toISOString()
        .split("T")[0];
    }

    // Date pour ordre de mission
    if (document.getElementById("missionDate")) {
      document.getElementById("missionDate").value = today;
    }
  }

  // Initialiser les écouteurs d'événements pour les champs de formulaire
  function initFormListeners() {
    // Ajouter des écouteurs d'événements pour tous les champs de formulaire
    const formInputs = document.querySelectorAll(
      "#contractForm input, #contractForm select, #contractForm textarea"
    );
    formInputs.forEach((input) => {
      input.addEventListener("change", () => {
        // Mettre à jour la prévisualisation automatiquement quand un champ change
        generateContractPreview();
      });
    });
  }

  // Initialiser les écouteurs d'événements pour l'ordre de mission
  function initMissionListeners() {
    // Ajouter une personne à l'ordre de mission
    if (addPersonBtn) {
      addPersonBtn.addEventListener("click", () => {
        const personDiv = document.createElement("div");
        personDiv.className = "mission-person";
        personDiv.innerHTML = `
          <input type="text" class="person-name" placeholder="Nom et prénom">
          <input type="text" class="person-cin" placeholder="N° CIN">
          <input type="text" class="person-position" placeholder="Poste occupé">
          <button type="button" class="remove-person">Supprimer</button>
        `;
        missionPersonsContainer.appendChild(personDiv);

        // Ajouter l'événement de suppression
        personDiv
          .querySelector(".remove-person")
          .addEventListener("click", () => {
            missionPersonsContainer.removeChild(personDiv);
            generateContractPreview();
          });

        // Ajouter les événements de changement
        const inputs = personDiv.querySelectorAll("input");
        inputs.forEach((input) => {
          input.addEventListener("input", generateContractPreview);
        });
      });
    }

    // Gérer la suppression de la première personne
    const firstRemoveBtn = document.querySelector(
      ".mission-person .remove-person"
    );
    if (firstRemoveBtn) {
      firstRemoveBtn.addEventListener("click", function () {
        const personDiv = this.parentElement;
        if (missionPersonsContainer.children.length > 1) {
          missionPersonsContainer.removeChild(personDiv);
        } else {
          // Vider les champs au lieu de supprimer
          personDiv.querySelectorAll("input").forEach((input) => {
            input.value = "";
          });
        }
        generateContractPreview();
      });
    }
  }

  // Gérer la connexion
  loginBtn.addEventListener("click", () => {
    const enteredUsername = username.value.trim();
    const enteredPassword = password.value.trim();

    if (!enteredUsername || !enteredPassword) {
      showLoginError("Veuillez remplir tous les champs");
      return;
    }

    const user = users.find(
      (u) => u.username === enteredUsername && u.password === enteredPassword
    );

    if (user) {
      // Stocker l'utilisateur dans localStorage
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          username: user.username,
          displayName: user.displayName,
        })
      );
      showMainPage(user.displayName);
      hideLoginError();
    } else {
      showLoginError("Nom d'utilisateur ou mot de passe incorrect");
    }
  });

  // Ajouter la possibilité de se connecter avec la touche Entrée
  password.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      loginBtn.click();
    }
  });

  // Afficher une erreur de connexion
  function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.add("visible");
  }

  // Masquer l'erreur de connexion
  function hideLoginError() {
    loginError.textContent = "";
    loginError.classList.remove("visible");
  }

  // Gérer la déconnexion
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    mainPage.style.display = "none";
    loginPage.style.display = "flex";
    username.value = "";
    password.value = "";
    hideLoginError();
  });

  // Gérer la navigation entre les types de contrats
  navbarItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Mettre à jour l'élément actif dans la navbar
      navbarItems.forEach((navItem) => navItem.classList.remove("active"));
      item.classList.add("active");

      // Mettre à jour le type de contrat
      const selectedType = item.getAttribute("data-contract");
      contractType.value = selectedType;

      // Masquer toutes les sections spécifiques
      cddFields.classList.remove("active");
      prestationFields.classList.remove("active");
      missionFields.classList.remove("active");

      // Par défaut, afficher les champs communs
      commonFields.classList.add("active");
      commonFields2.classList.add("active");

      // Afficher/masquer les champs spécifiques
      if (selectedType === "cdd") {
        cddFields.classList.add("active");
      } else if (selectedType === "cdi") {
        // Pas de champs spécifiques pour CDI
      } else if (selectedType === "prestation") {
        prestationFields.classList.add("active");
      } else if (selectedType === "mission") {
        missionFields.classList.add("active");
        // Masquer les sections communes pour l'ordre de mission
        commonFields.classList.remove("active");
        // Ne pas masquer la section common-fields-2 pour garder le bouton "Générer Word"
      }

      // Mettre à jour la prévisualisation
      generateContractPreview();
    });
  });

  // Fonction pour formater la date (JJ/MM/AAAA)
  function formatDate(dateString) {
    if (!dateString) return "__/__/____";

    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  }

  // Fonction pour convertir un nombre en texte (pour le salaire)
  function numberToWords(number) {
    if (!number) return "___";

    const units = [
      "",
      "Un",
      "Deux",
      "Trois",
      "Quatre",
      "Cinq",
      "Six",
      "Sept",
      "Huit",
      "Neuf",
    ];
    const teens = [
      "Dix",
      "Onze",
      "Douze",
      "Treize",
      "Quatorze",
      "Quinze",
      "Seize",
      "Dix-Sept",
      "Dix-Huit",
      "Dix-Neuf",
    ];
    const tens = [
      "",
      "Dix",
      "Vingt",
      "Trente",
      "Quarante",
      "Cinquante",
      "Soixante",
      "Soixante-Dix",
      "Quatre-Vingt",
      "Quatre-Vingt-Dix",
    ];

    if (number === 0) return "Zéro";

    let words = "";

    if (number >= 1000) {
      words +=
        Math.floor(number / 1000) === 1
          ? "Mille "
          : numberToWords(Math.floor(number / 1000)) + " Mille ";
      number %= 1000;
    }

    if (number >= 100) {
      words +=
        Math.floor(number / 100) === 1
          ? "Cent "
          : units[Math.floor(number / 100)] + " Cent ";
      number %= 100;
    }

    if (number >= 10 && number <= 19) {
      words += teens[number - 10] + " ";
      number = 0;
    } else if (number >= 20) {
      words += tens[Math.floor(number / 10)] + " ";
      number %= 10;
    }

    if (number > 0) {
      words += units[number] + " ";
    }

    return words.trim();
  }

  // Ajouter une tâche
  addTaskBtn.addEventListener("click", () => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
      <input type="text" class="task-input" placeholder="Entrez une tâche">
      <button type="button" class="remove-task">Supprimer</button>
    `;
    tasksContainer.appendChild(taskItem);

    // Ajouter l'événement de suppression
    taskItem.querySelector(".remove-task").addEventListener("click", () => {
      tasksContainer.removeChild(taskItem);
      generateContractPreview(); // Mettre à jour la prévisualisation après suppression
    });

    // Ajouter l'événement de changement pour mettre à jour la prévisualisation
    taskItem.querySelector(".task-input").addEventListener("input", () => {
      generateContractPreview();
    });

    // Focus sur le nouveau champ
    taskItem.querySelector(".task-input").focus();
  });

  // Supprimer une tâche (pour la première tâche)
  document.querySelector(".remove-task").addEventListener("click", function () {
    const taskItem = this.parentElement;
    if (tasksContainer.children.length > 1) {
      tasksContainer.removeChild(taskItem);
      generateContractPreview(); // Mettre à jour la prévisualisation après suppression
    } else {
      taskItem.querySelector(".task-input").value = "";
      generateContractPreview(); // Mettre à jour la prévisualisation après vidage
    }
  });

  // Ajouter l'événement de changement pour la première tâche
  document.querySelector(".task-input").addEventListener("input", () => {
    generateContractPreview();
  });

  // Prévisualiser le contrat
  previewBtn.addEventListener("click", () => {
    generateContractPreview();
  });

  // Générer le document Word
  generateWordBtn.addEventListener("click", () => {
    // Vérifier si les champs obligatoires sont remplis
    if (!validateForm()) {
      alert(
        "Veuillez remplir tous les champs obligatoires avant de générer le document Word."
      );
      return;
    }

    // Mettre à jour la prévisualisation
    generateContractPreview();

    // Afficher l'overlay de chargement
    loadingOverlay.style.display = "flex";

    // Récupérer les informations du contrat
    const selectedContractType = contractType.value;
    let fileName = "document.docx";

    if (selectedContractType === "cdd") {
      const employeeName =
        document.getElementById("employeeName").value || "employe";
      fileName = `contrat_CDD_${employeeName.replace(/\s+/g, "_")}.docx`;
    } else if (selectedContractType === "cdi") {
      const employeeName =
        document.getElementById("employeeName").value || "employe";
      fileName = `contrat_CDI_${employeeName.replace(/\s+/g, "_")}.docx`;
    } else if (selectedContractType === "prestation") {
      const employeeName =
        document.getElementById("employeeName").value || "prestataire";
      fileName = `contrat_Prestation_${employeeName.replace(/\s+/g, "_")}.docx`;
    } else if (selectedContractType === "mission") {
      const missionDate = document.getElementById("missionDate").value;
      const formattedDate = missionDate
        ? formatDate(missionDate).replace(/\//g, "-")
        : "date";
      fileName = `ordre_mission_${formattedDate}.docx`;
    }

    // Utiliser la bibliothèque docx.js pour générer un document Word
    setTimeout(() => {
      try {
        // Vérifier si docx est défini
        if (typeof window.docx === "undefined") {
          throw new Error(
            "La bibliothèque docx n'est pas chargée correctement. Veuillez rafraîchir la page ou vérifier votre connexion internet."
          );
        }

        // NOUVELLE APPROCHE: Créer un document avec une bordure à gauche
        // Nous allons utiliser une table avec deux colonnes:
        // - Une colonne étroite à gauche avec une bordure rouge
        // - Une colonne large à droite pour le contenu du document

        // Créer le contenu du document
        const documentContent = createDocumentContent();

        // Créer une table pour tout le document avec une bordure rouge à gauche
        const mainTable = new window.docx.Table({
          rows: [
            new window.docx.TableRow({
              children: [
                // Première colonne: bordure rouge à gauche (0.5% de large)
                new window.docx.TableCell({
                  width: {
                    size: 0.4,
                    type: window.docx.WidthType.PERCENTAGE,
                  },
                  shading: {
                    fill: "E94E4D", // Couleur rouge pour la bordure
                  },
                  children: [new window.docx.Paragraph({})],
                  borders: {
                    top: { style: window.docx.BorderStyle.NONE },
                    bottom: { style: window.docx.BorderStyle.NONE },
                    left: { style: window.docx.BorderStyle.NONE },
                    right: { style: window.docx.BorderStyle.NONE },
                  },
                }),
                // Deuxième colonne: contenu du document
                new window.docx.TableCell({
                  width: {
                    size: 99.7,
                    type: window.docx.WidthType.PERCENTAGE,
                  },
                  children: documentContent,
                  borders: {
                    top: { style: window.docx.BorderStyle.NONE },
                    bottom: { style: window.docx.BorderStyle.NONE },
                    left: { style: window.docx.BorderStyle.NONE },
                    right: { style: window.docx.BorderStyle.NONE },
                  },
                }),
              ],
            }),
          ],
          width: {
            size: 100,
            type: window.docx.WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: window.docx.BorderStyle.NONE },
            bottom: { style: window.docx.BorderStyle.NONE },
            left: { style: window.docx.BorderStyle.NONE },
            right: { style: window.docx.BorderStyle.NONE },
          },
        });

        // Créer le document Word
        const doc = new window.docx.Document({
          sections: [
            {
              properties: {
                page: {
                  size: {
                    width: 12240, // Largeur en twips (environ 21.6cm, légèrement plus large que A4)
                    height: 17280, // Hauteur en twips (environ 30.5cm, légèrement plus haut que A4)
                  },
                  margin: {
                    top: 1440,
                    right: 1440,
                    bottom: 1440,
                    left: 1440,
                  },
                },
              },
              children: [mainTable],
            },
          ],
        });

        // Générer le document Word
        window.docx.Packer.toBlob(doc).then((blob) => {
          // Créer un lien pour télécharger le fichier
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();

          // Nettoyer
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            loadingOverlay.style.display = "none";
          }, 100);
        });
      } catch (error) {
        console.error("Erreur lors de la génération du document Word:", error);
        alert(
          "Une erreur est survenue lors de la génération du document Word: " +
            error.message
        );
        loadingOverlay.style.display = "none";
      }
    }, 500);
  });

  // Fonction pour créer le contenu du document Word
  function createDocumentContent() {
    const selectedContractType = contractType.value;

    // Si c'est un ordre de mission
    if (selectedContractType === "mission") {
      return createMissionDocument();
    }

    const employeeName =
      document.getElementById("employeeName").value || "___________";
    const birthDate = document.getElementById("birthDate").value;
    const cinNumber =
      document.getElementById("cinNumber").value || "___________";
    const cinDate = document.getElementById("cinDate").value;
    const cinPlace = document.getElementById("cinPlace").value || "___________";
    const address = document.getElementById("address").value || "___________";
    const position = document.getElementById("position").value || "___________";
    const salary = document.getElementById("salary").value || "___";
    const signatureDate = document.getElementById("signatureDate").value;
    const signaturePlace =
      document.getElementById("signaturePlace").value || "Gabès";

    // Valeurs spécifiques au CDD
    let startDate = "";
    let endDate = "";
    if (selectedContractType === "cdd") {
      startDate = document.getElementById("startDate").value;
      endDate = document.getElementById("endDate").value;
    }

    // Valeurs spécifiques au contrat de prestation
    let prestationStartDate = "";
    let prestationEndDate = "";
    let prestationType = "";
    let prestationAmount = "";
    if (selectedContractType === "prestation") {
      prestationStartDate = document.getElementById(
        "prestationStartDate"
      ).value;
      prestationEndDate = document.getElementById("prestationEndDate").value;
      prestationType = document.getElementById("prestationType").value;
      prestationAmount = document.getElementById("prestationAmount").value;
    }

    // Récupérer les tâches
    const taskInputs = document.querySelectorAll(".task-input");
    const tasks = Array.from(taskInputs)
      .map((input) => input.value)
      .filter((task) => task.trim() !== "");

    // Titre du contrat
    let contractTitle = "CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE";
    if (selectedContractType === "cdi") {
      contractTitle = "CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE";
    } else if (selectedContractType === "prestation") {
      contractTitle = "CONTRAT DE PRESTATION DE SERVICES";
    }

    // Créer les éléments du document
    const children = [];

    // Créer un tableau pour l'en-tête avec logo
    const headerTable = new window.docx.Table({
      rows: [
        new window.docx.TableRow({
          children: [
            new window.docx.TableCell({
              width: {
                size: 70,
                type: window.docx.WidthType.PERCENTAGE,
              },
              children: [
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({
                      text: "ASSOCIATION DANSEURS CITOYENS SUD",
                      bold: true,
                      size: 24,
                    }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({ text: "N° M. 1474747/Y" }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({ text: "CIF: 5489707-T" }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({
                      text: "ADRESSE: 118 RUE MOHAMED-ALI GABÈS 6000",
                    }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({
                      text: "E-MAIL: contact@dcs.org",
                    }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({
                      text: "SITE WEB: https://dcs.org",
                    }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({ text: "TEL: 70 245 086" }),
                  ],
                }),
              ],
              borders: {
                top: { style: window.docx.BorderStyle.NONE },
                bottom: { style: window.docx.BorderStyle.NONE },
                left: { style: window.docx.BorderStyle.NONE },
                right: { style: window.docx.BorderStyle.NONE },
              },
            }),
            new window.docx.TableCell({
              width: {
                size: 30,
                type: window.docx.WidthType.PERCENTAGE,
              },
              children: [
                new window.docx.Paragraph({
                  alignment: window.docx.AlignmentType.RIGHT,
                  children: [
                    new window.docx.ImageRun({
                      data: fetchImageAsBase64(dcsLogo),
                      transformation: {
                        width: 100,
                        height: 50,
                      },
                    }),
                  ],
                }),
              ],
              borders: {
                top: { style: window.docx.BorderStyle.NONE },
                bottom: { style: window.docx.BorderStyle.NONE },
                left: { style: window.docx.BorderStyle.NONE },
                right: { style: window.docx.BorderStyle.NONE },
              },
            }),
          ],
        }),
      ],
      width: {
        size: 100,
        type: window.docx.WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: window.docx.BorderStyle.NONE },
        bottom: { style: window.docx.BorderStyle.NONE },
        left: { style: window.docx.BorderStyle.NONE },
        right: { style: window.docx.BorderStyle.NONE },
      },
    });

    children.push(headerTable);

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));

    // Titre du contrat
    children.push(
      new window.docx.Paragraph({
        alignment: window.docx.AlignmentType.CENTER,
        children: [
          new window.docx.TextRun({
            text: contractTitle,
            bold: true,
            size: 28,
            color: "E94E4D",
          }),
        ],
      })
    );

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));

    // Parties du contrat
    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({ text: "ENTRE LES SOUSSIGNÉS", bold: true }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: "L'association Danseurs Citoyens Sud (DCS), association tunisienne à but non lucratif, ayant son siège social à 115 Avenue Med Ali 6000 Gabès – Tunisie, immatriculée au Registre National des Entreprises de Tunis sous le N°B225948Z021, titulaire du matricule fiscale N°1447474/T/N/P/000, représentée aux fins des présentes par son président, Monsieur Aymen Goubaa et titulaire d'une CIN N°08632916, délivrée le 16 Mai 2024.",
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text:
              selectedContractType === "prestation"
                ? "Ci-après dénommée « le client »,"
                : "Ci-après dénommée « l'employeur »,",
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        alignment: window.docx.AlignmentType.RIGHT,
        children: [
          new window.docx.TextRun({ text: "D'une part,", bold: true }),
        ],
      })
    );

    // Informations de l'employé/prestataire
    const formattedBirthDate = birthDate ? formatDate(birthDate) : "__/__/____";
    const formattedCinDate = cinDate ? formatDate(cinDate) : "__/__/____";

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: `Madame/Monsieur ${employeeName}, né(e) le ${formattedBirthDate} et titulaire d'une CIN n° ${cinNumber} délivrée à ${cinPlace} le ${formattedCinDate}, ayant élu son domicile à ${address}.`,
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text:
              selectedContractType === "prestation"
                ? 'Ci-après dénommé "le prestataire"'
                : 'Ci-après dénommé(e) "l\'employé(e)"',
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        alignment: window.docx.AlignmentType.RIGHT,
        children: [
          new window.docx.TextRun({ text: "D'autre part,", bold: true }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: "IL A ETE ARRETE ET CONVENU CE QUI SUIT :",
            bold: true,
          }),
        ],
      })
    );

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));

    // Contenu spécifique selon le type de contrat
    if (selectedContractType === "cdd") {
      // Articles pour CDD
      addArticle(
        children,
        "Article 1 : Engagement et attribution de fonctions",
        [
          `L'employeur a, par les présentes, engagé à compter du ${
            startDate ? formatDate(startDate) : "__/__/____"
          }, madame/monsieur ${employeeName} pour exercer les fonctions ci-après définies.`,
          `Madame/Monsieur ${employeeName} entre au service de l'employeur en qualité de : ${position}`,
          "A ce titre, elle s'engage durant toute la période du contrat à :",
        ]
      );

      // Ajouter les tâches
      children.push(
        new window.docx.Paragraph({
          bullet: { level: 0 },
          children: [
            new window.docx.TextRun({
              text: tasks.length > 0 ? tasks.join("\n") : "Tâche à définir",
            }),
          ],
        })
      );

      children.push(
        new window.docx.Paragraph({
          children: [
            new window.docx.TextRun({
              text: "L'employé(e) s'engage à remettre à l'employeur trois (03) exemplaires originaux dûment signés du présent contrat de travail et ce, dans un délai de sept (07) jours à partir de la remise de ce contrat à l'employé(e) par l'employeur. A l'expiration de ce délai de 07 jours et à défaut de remise du dit contrat à l'employeur, le présent contrat est considéré comme accepté et sans réserve si ce contrat a déjà été signé par l'employeur lors de sa remise.",
            }),
          ],
        })
      );

      // Ajouter les autres articles du CDD
      addArticle(children, "Article 2 : Durée du contrat", [
        `2-1 : Le présent contrat est conclu pour une durée déterminée du ${
          startDate ? formatDate(startDate) : "__/__/____"
        } au ${endDate ? formatDate(endDate) : "__/__/____"}.`,
        "2-2 : Le contrat de travail conclu entre les parties prendra fin à l'expiration de la durée stipulée dans le paragraphe précédent, dès lors que l'employeur aura envoyé un avis par lettre recommandée avec accusé de réception huit jours (08) avant la fin de la période mentionnée.",
        "2-3 : L'employé(e) est soumis(e) à une période d'essai de trois mois, renouvelable selon l'évaluation du bureau de la direction de l'association, à compter de la date d'entrée en vigueur de ce contrat. L'employeur peut mettre fin à ce contrat pendant cette période d'essai s'il s'avère que l'employé(e) ne peut pas accomplir les tâches qui lui sont confiées, ou pour toute autre raison, quelle qu'elle soit. L'employeur peut également mettre fin à la période d'essai à tout moment et embaucher directement l'employé(e) sans attendre la fin de la période d'essai.",
        "2-4 : Les deux parties conviennent que, en cas de renouvellement du contrat, celui-ci sera prolongé pour la même durée et dans les mêmes conditions, sauf accord entre les parties sur des nouvelles conditions.",
      ]);

      // Ajouter les autres articles...
      addArticle(children, "Article 3 : Résiliation", [
        "Le présent contrat pourra être résilié de plein droit pour l'une des raisons indiquées ci-après à titre indicatif et non limitatif :",
        "3.1 Par consentement mutuel ou démission de l'employé(e) en respectant un délai de préavis d'un (01) mois.",
        "3.2 Faute lourde, insuffisance professionnelle de l'employé(e) conformément à la loi, indiscipline caractérisée, refus d'obtempérer aux ordres donnés ou d'accomplir le travail pour lequel elle a été engagée.",
        "3.3 Divulgation du secret professionnel.",
        "3.4 État d'ébriété pendant les heures de service.",
        "3.5 Interruption de travail non motivée dans les délais réglementaires.",
        "3.6 Inobservation des consignes de sécurité ou détérioration intentionnelle du matériel mis à la disposition de l'employé(e).",
        "3.7 Et en général, pour toute violation par l'employé(e) de l'une des clauses du présent contrat, et dans tous les cas prévus par la réglementation, sans qu'elle puisse prétendre à aucun préavis ou indemnité et sans préjudice de toute demande de dommages et intérêts par l'employeur.",
      ]);

      addArticle(children, "Article 4 : Rémunération", [
        `4.1 L'Employé(e) recevra, en contrepartie de ses fonctions, une rémunération constituée d'un salaire mensuel net de ${salary} dinars tunisien (${
          salary ? numberToWords(Number.parseInt(salary)) : "___"
        } Dinars Tunisien) versé en mensualités.`,
      ]);

      // Ajouter les autres articles du CDD...
      addArticle(
        children,
        "Article 5 : Couverture médicale et sécurité sociale",
        [
          "5.1 L'employeur s'engage à affilier l'employé(e) à la caisse nationale de sécurité sociale et à la mutuelle de son choix.",
        ]
      );

      addArticle(children, "Article 6 : Autres dispositions générales", [
        "6.1 L'employé(e) s'engage à respecter le règlement intérieur de l'entreprise.",
        "6.2 L'employé(e) s'engage à ne pas divulguer les informations confidentielles de l'entreprise.",
        "6.3 L'employé(e) s'engage à ne pas exercer d'activité concurrente à celle de l'entreprise pendant la durée du contrat et pendant une période de deux ans après la fin du contrat.",
        "6.4 Tout litige relatif à l'interprétation ou à l'exécution du présent contrat sera soumis à la compétence des tribunaux de Tunis.",
      ]);
      addArticle(children, "Article 7 : Référence", [
        "Pour toute autre question, le présent contrat est soumis au code du travail ainsi qu’au règlement intérieur de l’employeur s’il en existe un .",
      ]);
      addArticle(
        children,
        "Article 8 : Affiliation à la C.N.S.S et Assurance Groupe",
        [
          "8.1 Dès son entrée au service de l’employeur, l’employée sera affiliée au régime légal et obligatoire de la C.N.S.S et couvert contre les accidents de travail.",
          "8.2 En outre, l’employée bénéficie d’une couverture médicale conformément à un tableau de prestation moyennant une contribution de son salaire brut prélevé mensuellement.",
          " 8.3 Aussi. L’employeur ne pourra être poursuivi en cas de décès ou d’invalidité de l’employée survenant soit durant son service soit en conséquence de son service. ",
        ]
      );
      addArticle(
        children,
        "Article 9 : Lieu de Travail et clause de mobilité",
        [
          ` L’employeur se réserve le droit d’affecter et / ou de muter l’employée, selon les besoins de son organisation, dans toute autre organisme étatique et/ou privé, national et/ou international appartenant directement ou indirectement à l’organisation DCS et d’une manière générale toute entité exerçant les activités et/ou prestations de l’employeur, sans que cela ne constitue une modification du présent contrat de travail. Le refus de cette mutation et / ou affectation sera réputé comme une inexécution de son obligation contractuelle et donnera lieu à son licenciement pour faute grave. ${employeeName} accepte expressément et irrévocablement toute mission tant sur le territoire tunisien ou à l’étranger quelle que soit sa durée . `,
        ]
      );
      addArticle(children, "Article 10 : Règlement Intérieur", [
        `    ${employeeName} s’engage à accepter et respecter le règlement intérieur de l’employeur.`,
      ]);

      addArticle(children, "Article 11 : Absence", [
        "L’absence pour maladie doit être justifiée dans les 48 heures suivant l’interruption de travail par un certificat médical précisant sa durée et sa cause.",
      ]);
      addArticle(children, "Article 12 : Régime Horaire", [
        "L'employé(e) aura un régime horaire de 45 heures par semaine.",
      ]);

      addArticle(children, "Article 13 : Transfert des Engagements", [
        "Il est expressément convenu entre les parties que les engagements et obligations émanant de ce contrat pourraient être transférés d'une manière globale et indissociable, en prenant en considération la date d'effet et l'ancienneté naissant à travers ce contrat, vers une nouvelle entité de l'organisation.",
      ]);
      addArticle(children, "Article 14 : Attribution de compétence", [
        "Tout litige découlant du contenu du présent contrat de travail sera résolu en vertu du droit tunisien du travail et du ressort exclusif des tribunaux de Gabès seuls compétents.",
      ]);
    } else if (selectedContractType === "cdi") {
      // Articles pour CDI
      // Similaire au CDD mais avec les spécificités du CDI
      addArticle(
        children,
        "Article 1 : Engagement et attribution de fonctions",
        [
          `L'employeur a, par les présentes, engagé à compter du ${
            signatureDate ? formatDate(signatureDate) : "__/__/____"
          }, madame/monsieur ${employeeName} pour exercer les fonctions ci-après définies.`,
          `Madame/Monsieur ${employeeName} entre au service de l'employeur en qualité de : ${position}`,
          "A ce titre, elle s'engage à :",
        ]
      );

      // Ajouter les tâches
      children.push(
        new window.docx.Paragraph({
          bullet: { level: 0 },
          children: [
            new window.docx.TextRun({
              text: tasks.length > 0 ? tasks.join("\n") : "Tâche à définir",
            }),
          ],
        })
      );

      // Ajouter les autres articles du CDI...
      // (Similaire au CDD mais avec les spécificités du CDI)
    } else if (selectedContractType === "prestation") {
      // Articles pour contrat de prestation
      // Similaire aux autres mais avec les spécificités de la prestation
      addArticle(children, "Article 1 : Objet du contrat", [
        "Le présent contrat a pour objet de définir les conditions dans lesquelles le prestataire s'engage à fournir au client les prestations de services décrites ci-après.",
        `Le prestataire, Madame/Monsieur ${employeeName}, s'engage à fournir au client des prestations de ${
          prestationType === "formation"
            ? "formation"
            : prestationType === "consultation"
            ? "consultation"
            : prestationType === "evenement"
            ? "organisation d'événement"
            : "services"
        } en qualité de ${position}.`,
        "Ces prestations comprennent notamment :",
      ]);

      // Ajouter les tâches
      children.push(
        new window.docx.Paragraph({
          bullet: { level: 0 },
          children: [
            new window.docx.TextRun({
              text: tasks.length > 0 ? tasks.join("\n") : "Tâche à définir",
            }),
          ],
        })
      );

      // Ajouter les autres articles de prestation...
      // (Similaire aux autres mais avec les spécificités de la prestation)
    }

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));

    // Conclusion commune
    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: "Fait en deux exemplaires originaux, dont un pour chacune des parties.",
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: `À ${signaturePlace}, le ${
              signatureDate ? formatDate(signatureDate) : "__/__/____"
            }`,
          }),
        ],
      })
    );

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));
    children.push(new window.docx.Paragraph({}));

    // Signatures
    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text:
              selectedContractType === "prestation"
                ? "LE CLIENT"
                : "L'EMPLOYEUR",
            bold: true,
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: "Association Danseurs Citoyens Sud",
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: "Aymen Goubaa",
          }),
        ],
      })
    );

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));
    children.push(new window.docx.Paragraph({}));

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text:
              selectedContractType === "prestation"
                ? "LE PRESTATAIRE"
                : "L'EMPLOYÉ(E)",
            bold: true,
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: employeeName,
          }),
        ],
      })
    );

    return children;
  }

  // Fonction pour créer le document Word de l'ordre de mission
  function createMissionDocument() {
    // Récupérer les personnes concernées
    const personDivs = document.querySelectorAll(".mission-person");
    const persons = Array.from(personDivs).map((div) => {
      return {
        name: div.querySelector(".person-name").value || "___________",
        cin: div.querySelector(".person-cin").value || "___________",
        position: div.querySelector(".person-position").value || "___________",
      };
    });

    // Récupérer les autres informations
    const departurePlace =
      document.getElementById("departurePlace").value || "Gabès";
    const destinationPlace =
      document.getElementById("destinationPlace").value || "___________";
    const missionDate = document.getElementById("missionDate").value;
    const formattedDate = missionDate ? formatDate(missionDate) : "__/__/____";
    const missionObjective =
      document.getElementById("missionObjective").value || "___________";
    const eventName = document.getElementById("eventName").value || "";
    const vehicleInfo = document.getElementById("vehicleInfo").value || "";

    // Créer les éléments du document
    const children = [];

    // Créer un tableau pour l'en-tête avec logo
    const headerTable = new window.docx.Table({
      rows: [
        new window.docx.TableRow({
          children: [
            new window.docx.TableCell({
              width: {
                size: 70,
                type: window.docx.WidthType.PERCENTAGE,
              },
              children: [
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({
                      text: "ASSOCIATION DANSEURS CITOYENS SUD",
                      bold: true,
                      size: 24,
                    }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({ text: "M/F: 1447474/T" }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({ text: "N° CNSS: 548790-77" }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({
                      text: "ADRESSE: 115 RUE MOHAMED-ALI GABÈS 6000",
                    }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({
                      text: "E-MAIL: contact@dcs.org",
                    }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({
                      text: "SITE WEB: https://v-dcs.org",
                    }),
                  ],
                }),
                new window.docx.Paragraph({
                  children: [
                    new window.docx.TextRun({ text: "TEL: 75 824 405" }),
                  ],
                }),
              ],
              borders: {
                top: { style: window.docx.BorderStyle.NONE },
                bottom: { style: window.docx.BorderStyle.NONE },
                left: { style: window.docx.BorderStyle.NONE },
                right: { style: window.docx.BorderStyle.NONE },
              },
            }),
            new window.docx.TableCell({
              width: {
                size: 30,
                type: window.docx.WidthType.PERCENTAGE,
              },
              children: [
                new window.docx.Paragraph({
                  alignment: window.docx.AlignmentType.RIGHT,
                  children: [
                    new window.docx.ImageRun({
                      data: fetchImageAsBase64(dcsLogo),
                      transformation: {
                        width: 100,
                        height: 50,
                      },
                    }),
                  ],
                }),
              ],
              borders: {
                top: { style: window.docx.BorderStyle.NONE },
                bottom: { style: window.docx.BorderStyle.NONE },
                left: { style: window.docx.BorderStyle.NONE },
                right: { style: window.docx.BorderStyle.NONE },
              },
            }),
          ],
        }),
      ],
      width: {
        size: 100,
        type: window.docx.WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: window.docx.BorderStyle.NONE },
        bottom: { style: window.docx.BorderStyle.NONE },
        left: { style: window.docx.BorderStyle.NONE },
        right: { style: window.docx.BorderStyle.NONE },
      },
    });

    children.push(headerTable);

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));

    // Titre de l'ordre de mission
    children.push(
      new window.docx.Paragraph({
        alignment: window.docx.AlignmentType.CENTER,
        children: [
          new window.docx.TextRun({
            text: "Ordre De Mission",
            bold: true,
            size: 28,
          }),
        ],
      })
    );

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));

    // Introduction
    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: "Par la présente, l'Association Danseurs Citoyens Sud (DCS), dont le siège social est situé au 115, rue Mohamed Ali, 6000 Gabès, autorise à son employé :",
          }),
        ],
      })
    );

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));

    // Personnes concernées
    for (const person of persons) {
      children.push(
        new window.docx.Paragraph({
          children: [
            new window.docx.TextRun({
              text: `• Monsieur ${person.name}, titulaire de la carte d'identité nationale n° ${person.cin}, résidant à Gabès et occupant le poste de ${person.position},`,
            }),
          ],
        })
      );
    }

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));

    // Déplacement
    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: `À effectuer un déplacement professionnel de ${departurePlace} vers ${destinationPlace}.`,
          }),
        ],
      })
    );

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));

    // Détails de la mission
    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: `Date du déplacement : ${formattedDate}`,
            bold: true,
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: `Objectif de la mission : ${missionObjective}`,
            bold: true,
          }),
        ],
      })
    );

    if (eventName) {
      children.push(
        new window.docx.Paragraph({
          children: [
            new window.docx.TextRun({
              text: `Dans le cadre de leur participation au ${eventName}.`,
              bold: true,
            }),
          ],
        })
      );
    }

    if (vehicleInfo) {
      children.push(
        new window.docx.Paragraph({
          children: [
            new window.docx.TextRun({
              text: `Pour ce déplacement, nos collaborateurs utilisent un véhicule de location (${vehicleInfo}).`,
              bold: true,
            }),
          ],
        })
      );
    }

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));

    // Frais de déplacement
    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: "Les frais de déplacement seront entièrement pris en charge par l'Association Danseurs Citoyens Sud (DCS), sous réserve de la présentation des pièces justificatives et de leur conformité avec la politique interne de l'Association.",
            italics: true,
          }),
        ],
      })
    );

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));
    children.push(new window.docx.Paragraph({}));

    // Date et signature
    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: `Fait à Gabès, le ${formattedDate}`,
          }),
        ],
      })
    );

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));
    children.push(new window.docx.Paragraph({}));

    // Signature
    children.push(
      new window.docx.Paragraph({
        alignment: window.docx.AlignmentType.RIGHT,
        children: [
          new window.docx.TextRun({
            text: "Représentant de l'Association",
            bold: true,
          }),
        ],
      })
    );

    // Ajouter un espace
    children.push(new window.docx.Paragraph({}));
    children.push(new window.docx.Paragraph({}));
    children.push(new window.docx.Paragraph({}));

    // Pied de page
    children.push(
      new window.docx.Paragraph({
        alignment: window.docx.AlignmentType.CENTER,
        children: [
          new window.docx.TextRun({
            text: "M/F: 1447474/T - RNE: 0229048201",
            size: 16,
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        alignment: window.docx.AlignmentType.CENTER,
        children: [
          new window.docx.TextRun({
            text: "Adresse: 115 Rue Mohamed Ali 6000, Gabès",
            size: 16,
          }),
        ],
      })
    );
    children.push(
      new window.docx.Paragraph({
        alignment: window.docx.AlignmentType.CENTER,
        children: [
          new window.docx.TextRun({
            text: "Adresse électronique: contact@dcs.org",
            size: 16,
          }),
        ],
      })
    );

    children.push(
      new window.docx.Paragraph({
        alignment: window.docx.AlignmentType.CENTER,
        children: [
          new window.docx.TextRun({
            text: "N° de téléphone: 75824405",
            size: 16,
          }),
        ],
      })
    );

    return children;
  }

  // Fonction utilitaire pour ajouter un article au document
  function addArticle(children, title, paragraphs) {
    // Ajouter le titre de l'article
    children.push(
      new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: title,
            bold: true,
            color: "4A6DA7",
          }),
        ],
      })
    );

    // Ajouter les paragraphes de l'article
    paragraphs.forEach((paragraph) => {
      children.push(
        new window.docx.Paragraph({
          children: [
            new window.docx.TextRun({
              text: paragraph,
            }),
          ],
        })
      );
    });

    // Ajouter un espace après l'article
    children.push(new window.docx.Paragraph({}));
  }

  // Fonction pour convertir une image en base64
  function fetchImageAsBase64(url) {
    // Créer un canvas pour dessiner l'image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Créer une promesse pour charger l'image
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Important pour éviter les erreurs CORS

      img.onload = function () {
        // Définir les dimensions du canvas
        canvas.width = img.width;
        canvas.height = img.height;

        // Dessiner l'image sur le canvas
        ctx.drawImage(img, 0, 0);

        // Convertir le canvas en base64 (format PNG)
        try {
          // Obtenir les données de l'image en base64 et les convertir en tableau d'octets
          const base64 = canvas
            .toDataURL("image/png")
            .replace(/^data:image\/(png|jpg);base64,/, "");
          const binaryString = window.atob(base64);
          const bytes = new Uint8Array(binaryString.length);

          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          resolve(bytes.buffer);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = function () {
        reject(new Error("Impossible de charger l'image"));
      };

      // Charger l'image
      img.src = url;
    });
  }

  // Valider le formulaire avant de générer le document
  function validateForm() {
    const selectedContractType = contractType.value;

    // Validation pour l'ordre de mission
    if (selectedContractType === "mission") {
      const requiredFields = [
        "departurePlace",
        "destinationPlace",
        "missionDate",
        "missionObjective",
      ];

      // Vérifier que tous les champs requis sont remplis
      for (const field of requiredFields) {
        const element = document.getElementById(field);
        if (element && !element.value.trim()) {
          element.focus();
          return false;
        }
      }

      // Vérifier qu'au moins une personne est définie
      const personNames = Array.from(document.querySelectorAll(".person-name"))
        .map((input) => input.value.trim())
        .filter((name) => name !== "");

      if (personNames.length === 0) {
        document.querySelector(".person-name").focus();
        return false;
      }

      return true;
    }

    // Validation pour les autres types de contrats
    const requiredFields = [
      "employeeName",
      "birthDate",
      "cinNumber",
      "cinDate",
      "cinPlace",
      "address",
      "position",
      "salary",
      "signatureDate",
      "signaturePlace",
    ];

    // Ajouter les champs spécifiques selon le type de contrat
    if (contractType.value === "cdd") {
      requiredFields.push("startDate", "endDate");
    } else if (contractType.value === "prestation") {
      requiredFields.push(
        "prestationStartDate",
        "prestationEndDate",
        "prestationType",
        "prestationAmount"
      );
    }

    // Vérifier que tous les champs requis sont remplis
    for (const field of requiredFields) {
      const element = document.getElementById(field);
      if (element && !element.value.trim()) {
        element.focus();
        return false;
      }
    }

    // Vérifier qu'au moins une tâche est définie
    const tasks = Array.from(document.querySelectorAll(".task-input"))
      .map((input) => input.value.trim())
      .filter((task) => task !== "");

    if (tasks.length === 0) {
      document.querySelector(".task-input").focus();
      return false;
    }

    return true;
  }

  // Générer la prévisualisation du contrat
  function generateContractPreview() {
    // Récupérer les valeurs du formulaire
    const selectedContractType = contractType.value;

    // Si c'est un ordre de mission
    if (selectedContractType === "mission") {
      generateMissionPreview();
      return;
    }

    const employeeName = document.getElementById("employeeName").value;
    const birthDate = document.getElementById("birthDate").value;
    const cinNumber = document.getElementById("cinNumber").value;
    const cinDate = document.getElementById("cinDate").value;
    const cinPlace = document.getElementById("cinPlace").value;
    const address = document.getElementById("address").value;
    const position = document.getElementById("position").value;
    const salary = document.getElementById("salary").value;
    const signatureDate = document.getElementById("signatureDate").value;
    const signaturePlace = document.getElementById("signaturePlace").value;

    // Valeurs spécifiques au CDD
    let startDate = "";
    let endDate = "";
    if (selectedContractType === "cdd") {
      startDate = document.getElementById("startDate").value;
      endDate = document.getElementById("endDate").value;
    }

    // Valeurs spécifiques au contrat de prestation
    let prestationStartDate = "";
    let prestationEndDate = "";
    let prestationType = "";
    let prestationAmount = "";
    if (selectedContractType === "prestation") {
      prestationStartDate = document.getElementById(
        "prestationStartDate"
      ).value;
      prestationEndDate = document.getElementById("prestationEndDate").value;
      prestationType = document.getElementById("prestationType").value;
      prestationAmount = document.getElementById("prestationAmount").value;
    }

    // Récupérer les tâches
    const taskInputs = document.querySelectorAll(".task-input");
    const tasks = Array.from(taskInputs)
      .map((input) => input.value)
      .filter((task) => task.trim() !== "");

    // Générer le contenu du contrat en fonction du type
    let contractHTML = "";

    // En-tête commun pour tous les types de contrats
    const contractHeader = `
      <div class="contract-header">
          <div class="header-left">
              <div><strong>ASSOCIATION DANSEURS CITOYENS SUD</strong></div>
              <div>M/F: 1447474/T</div>
              <div>N° CNSS: 548790-77</div>
              <div>ADRESSE: 115 RUE MOHAMED-ALI GABÈS 6000</div>
              <div>E-MAIL: contact@dcs.org</div>
              <div>SITE WEB: https://v-dcs.org</div>
              <div>TEL: 75 824 405</div>
          </div>
          <div class="header-right">
              <img src="${dcsLogo}" alt="DCS Logo" style="width: 100px;">
          </div>
      </div>
      
      <div class="contract-title">
          ${
            selectedContractType === "cdd"
              ? "CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE"
              : selectedContractType === "cdi"
              ? "CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE"
              : "CONTRAT DE PRESTATION DE SERVICES"
          }
      </div>
      
      <div class="contract-parties">
          <p><strong>ENTRE LES SOUSSIGNÉS</strong></p>
          <p>
              L'association Danseurs Citoyens Sud (DCS), association tunisienne à but non lucratif, ayant son 
              siège social à 115 Avenue Med Ali 6000 Gabès – Tunisie, immatriculée au Registre National des 
              Entreprises de Tunis sous le N°B225948Z021, titulaire du matricule fiscale N°1447474/T/N/P/000, 
              représentée aux fins des présentes par son président, Monsieur Aymen Goubaa et titulaire 
              d'une CIN N°08632916, délivrée le 16 Mai 2024.
          </p>
          <p>Ci-après dénommée ${
            selectedContractType === "prestation"
              ? "« le client »"
              : "« l'employeur »"
          },</p>
          <p style="text-align: right;"><strong>D'une part,</strong></p>
          
          <p>
              ${
                employeeName
                  ? `Madame/Monsieur ${employeeName}`
                  : "Madame/Monsieur _________"
              }, 
              ${
                birthDate
                  ? `né(e) le ${formatDate(birthDate)}`
                  : "né(e) le __/__/____"
              } et titulaire d'une CIN n° 
              ${cinNumber || "_________"} délivrée à ${
      cinPlace || "_________"
    } le 
              ${
                cinDate ? formatDate(cinDate) : "__/__/____"
              }, ayant élu son domicile à 
              ${address || "_________"}.
          </p>
          <p>Ci-après dénommé${
            selectedContractType === "prestation"
              ? ' "le prestataire"'
              : '(e) "l\'employé(e)"'
          }</p>
          <p style="text-align: right;"><strong>D'autre part,</strong></p>
          
          <p><strong>IL A ETE ARRETE ET CONVENU CE QUI SUIT :</strong></p>
      </div>
    `;

    // Contenu spécifique au type de contrat
    if (selectedContractType === "cdd") {
      // Contrat CDD
      contractHTML = `
        ${contractHeader}
        
        <div class="contract-content">
            <div class="article">
                <div class="article-title">Article 1 : Engagement et attribution de fonctions</div>
                <p>
                    L'employeur a, par les présentes, engagé à compter du 
                    ${startDate ? formatDate(startDate) : "__/__/____"}, 
                    ${
                      employeeName
                        ? `madame/monsieur ${employeeName}`
                        : "madame/monsieur _________"
                    } 
                    pour exercer les fonctions ci-après définies.
                </p>
                <p>
                    ${
                      employeeName
                        ? `Madame/Monsieur ${employeeName}`
                        : "madame/monsieur _________"
                    } 
                    entre au service de l'employeur en qualité de : 
                    <strong>${position || "_________"}</strong>
                </p>
                <p>A ce titre, elle s'engage durant toute la période du contrat à :</p>
                <ul class="tasks-list">
                    ${
                      tasks.length > 0
                        ? tasks.map((task) => `<li>${task}</li>`).join("")
                        : "<li>Tâche à définir</li>"
                    }
                </ul>
                <p>
                    L'employé(e) s'engage à remettre à l'employeur trois (03) exemplaires originaux dûment signés du 
                    présent contrat de travail et ce, dans un délai de sept (07) jours à partir de la remise de ce contrat 
                    à l'employé(e) par l'employeur. A l'expiration de ce délai de 07 jours et à défaut de remise du dit 
                    contrat à l'employeur, le présent contrat est considéré comme accepté et sans réserve si ce 
                    contrat a déjà été signé par l'employeur lors de sa remise.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 2 : Durée du contrat</div>
                <p>
                    2-1 : Le présent contrat est conclu pour une durée déterminée du 
                    ${startDate ? formatDate(startDate) : "__/__/____"} au 
                    ${endDate ? formatDate(endDate) : "__/__/____"}.
                </p>
                <p>
                    2-2 : Le contrat de travail conclu entre les parties prendra fin à l'expiration de la durée stipulée 
                    dans le paragraphe précédent, dès lors que l'employeur aura envoyé un avis par lettre 
                    recommandée avec accusé de réception huit jours (08) avant la fin de la période mentionnée.
                </p>
                <p>
                    2-3 : L'employé(e) est soumis(e) à une période d'essai de trois mois, renouvelable selon l'évaluation du 
                    bureau de la direction de l'association, à compter de la date d'entrée en vigueur de ce contrat. 
                    L'employeur peut mettre fin à ce contrat pendant cette période d'essai s'il s'avère que l'employé(e) ne peut 
                    pas accomplir les tâches qui lui sont confiées, ou pour toute autre raison, quelle qu'elle soit. 
                    L'employeur peut également mettre fin à la période d'essai à tout moment et embaucher 
                    directement l'employé(e) sans attendre la fin de la période d'essai.
                </p>
                <p>
                    2-4 : Les deux parties conviennent que, en cas de renouvellement du contrat, celui-ci sera 
                    prolongé pour la même durée et dans les mêmes conditions, sauf accord entre les parties sur des 
                    nouvelles conditions.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 3 : Résiliation</div>
                <p>
                    Le présent contrat pourra être résilié de plein droit pour l'une des raisons indiquées ci-après à 
                    titre indicatif et non limitatif :
                </p>
                <p>
                    3.1 Par consentement mutuel ou démission de l'employé(e) en respectant un délai de préavis 
                    d'un (01) mois.
                </p>
                <p>
                    3.2 Faute lourde, insuffisance professionnelle de l'employé(e) conformément à la loi, 
                    indiscipline caractérisée, refus d'obtempérer aux ordres donnés ou d'accomplir le travail pour 
                    lequel elle a été engagée.
                </p>
                <p>3.3 Divulgation du secret professionnel.</p>
                <p>3.4 État d'ébriété pendant les heures de service.</p>
                <p>3.5 Interruption de travail non motivée dans les délais réglementaires.</p>
                <p>
                    3.6 Inobservation des consignes de sécurité ou détérioration intentionnelle du matériel mis à 
                    la disposition de l'employé(e).
                </p>
                <p>
                    3.7 Et en général, pour toute violation par l'employé(e) de l'une des clauses du présent 
                    contrat, et dans tous les cas prévus par la réglementation, sans qu'elle puisse prétendre à 
                    aucun préavis ou indemnité et sans préjudice de toute demande de dommages et intérêts par 
                    l'employeur.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 4 : Rémunération</div>
                <p>
                    4.1 L'Employé(e) recevra, en contrepartie de ses fonctions, une rémunération constituée d'un 
                    salaire mensuel net de ${
                      salary || "___"
                    } dinars tunisien (${
        salary ? numberToWords(Number.parseInt(salary)) : "___"
      } Dinars Tunisien) versé en mensualités.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 5 : Couverture médicale et sécurité sociale</div>
                <p>
                    5.1 L'employeur s'engage à affilier l'employé(e) à la caisse nationale de sécurité sociale et à la mutuelle de son choix.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 6 : Autres dispositions générales</div>
                <p>
                    6.1 L'employé(e) s'engage à respecter le règlement intérieur de l'entreprise.
                </p>
                <p>
                    6.2 L'employé(e) s'engage à ne pas divulguer les informations confidentielles de l'entreprise.
                </p>
                <p>
                    6.3 L'employé(e) s'engage à ne pas exercer d'activité concurrente à celle de l'entreprise pendant la durée du contrat et pendant une période de deux ans après la fin du contrat.
                </p>
                <p>
                    6.4 Tout litige relatif à l'interprétation ou à l'exécution du présent contrat sera soumis à la compétence des tribunaux de Tunis.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 12 : Régime Horaire</div>
                <p>L'employé(e) aura un régime horaire de 45 heures par semaine.</p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 13 : Transfert des Engagements</div>
                <p>
                    Il est expressément convenu entre les parties que les engagements et obligations émanant de 
                    ce contrat pourraient être transférés d'une manière globale et indissociable, en prenant en 
                    considération la date d'effet et l'ancienneté naissant à travers ce contrat, vers une nouvelle 
                    entité de l'organisation.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 14 : Attribution de compétence</div>
                <p>
                    Tout litige découlant du contenu du présent contrat de travail sera résolu en vertu du droit 
                    tunisien du travail et du ressort exclusif des tribunaux de Gabès seuls compétents.
                </p>
            </div>
            
            <p>Fait en deux exemplaires originaux, dont un pour chacune des parties.</p>
            
            <p>À ${signaturePlace || "Gabès"}, le ${
        signatureDate ? formatDate(signatureDate) : "__/__/____"
      }</p>
            
            <div class="signatures">
                <div class="signature-block">
                    <div class="signature-title">L'EMPLOYEUR</div>
                    <div class="signature-name">Association Danseurs Citoyens Sud<br>Aymen Goubaa</div>
                </div>
                
                <div class="signature-block">
                    <div class="signature-title">L'EMPLOYÉ(E)</div>
                    <div class="signature-name">${
                      employeeName || "_________"
                    }</div>
                </div>
            </div>
        </div>
      `;
    } else if (selectedContractType === "cdi") {
      // Contrat CDI
      contractHTML = `
        ${contractHeader}
        
        <div class="contract-content">
            <div class="article">
                <div class="article-title">Article 1 : Engagement et attribution de fonctions</div>
                <p>
                    L'employeur a, par les présentes, engagé à compter du 
                    ${
                      signatureDate ? formatDate(signatureDate) : "__/__/____"
                    }, 
                    ${
                      employeeName
                        ? `madame/monsieur ${employeeName}`
                        : "madame/monsieur _________"
                    } 
                    pour exercer les fonctions ci-après définies.
                </p>
                <p>
                    ${
                      employeeName
                        ? `Madame/Monsieur ${employeeName}`
                        : "madame/monsieur _________"
                    } 
                    entre au service de l'employeur en qualité de : 
                    <strong>${position || "_________"}</strong>
                </p>
                <p>A ce titre, elle s'engage à :</p>
                <ul class="tasks-list">
                    ${
                      tasks.length > 0
                        ? tasks.map((task) => `<li>${task}</li>`).join("")
                        : "<li>Tâche à définir</li>"
                    }
                </ul>
                <p>
                    L'employé(e) s'engage à remettre à l'employeur trois (03) exemplaires originaux dûment signés du 
                    présent contrat de travail et ce, dans un délai de sept (07) jours à partir de la remise de ce contrat 
                    à l'employé(e) par l'employeur. A l'expiration de ce délai de 07 jours et à défaut de remise du dit 
                    contrat à l'employeur, le présent contrat est considéré comme accepté et sans réserve si ce 
                    contrat a déjà été signé par l'employeur lors de sa remise.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 2 : Durée du contrat</div>
                <p>
                    2-1 : Le présent contrat est conclu pour une durée indéterminée à compter du 
                    ${signatureDate ? formatDate(signatureDate) : "__/__/____"}.
                </p>
                <p>
                    2-2 : L'employé(e) est soumis(e) à une période d'essai de six mois, renouvelable une fois selon l'évaluation du 
                    bureau de la direction de l'association, à compter de la date d'entrée en vigueur de ce contrat. 
                    L'employeur peut mettre fin à ce contrat pendant cette période d'essai s'il s'avère que l'employé(e) ne peut 
                    pas accomplir les tâches qui lui sont confiées, ou pour toute autre raison, quelle qu'elle soit, sans préavis 
                    ni indemnité.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 3 : Résiliation</div>
                <p>
                    Le présent contrat pourra être résilié dans les conditions suivantes :
                </p>
                <p>
                    3.1 Par l'employeur, en respectant un préavis d'un (01) mois pour les employés ayant moins d'un an 
                    d'ancienneté, et de deux (02) mois pour les employés ayant plus d'un an d'ancienneté, sauf en cas de 
                    faute grave ou lourde.
                </p>
                <p>
                    3.2 Par l'employé(e), en respectant un préavis d'un (01) mois.
                </p>
                <p>
                    3.3 Sans préavis en cas de faute lourde, notamment : divulgation du secret professionnel, état d'ébriété 
                    pendant les heures de service, absence injustifiée de plus de trois jours, inobservation des consignes de 
                    sécurité, ou détérioration intentionnelle du matériel.
                </p>
                <p>
                    3.4 Et en général, pour toute violation par l'employé(e) de l'une des clauses du présent 
                    contrat, et dans tous les cas prévus par la réglementation, sans qu'elle puisse prétendre à 
                    aucun préavis ou indemnité et sans préjudice de toute demande de dommages et intérêts par 
                    l'employeur.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 4 : Rémunération</div>
                <p>
                    4.1 L'Employé(e) recevra, en contrepartie de ses fonctions, une rémunération constituée d'un 
                    salaire mensuel net de ${
                      salary || "___"
                    } dinars tunisien (${
        salary ? numberToWords(Number.parseInt(salary)) : "___"
      } Dinars Tunisien) versé en mensualités.
                </p>
                <p>
                    4.2 Cette rémunération pourra être révisée périodiquement en fonction des performances de l'employé(e) 
                    et des résultats de l'association.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 5 : Congés payés</div>
                <p>
                    5.1 L'employé(e) bénéficiera des congés payés conformément à la législation en vigueur, soit un congé 
                    annuel de 30 jours calendaires par an.
                </p>
                <p>
                    5.2 Les dates de congés seront déterminées par accord entre l'employeur et l'employé(e), en fonction 
                    des nécessités du service.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 6 : Couverture médicale et sécurité sociale</div>
                <p>
                    6.1 L'employeur s'engage à affilier l'employé(e) à la caisse nationale de sécurité sociale et à la mutuelle de son choix.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 7 : Obligations de l'employée</div>
                <p>
                    7.1 L'employé(e) s'engage à respecter le règlement intérieur de l'association.
                </p>
                <p>
                    7.2 L'employé(e) s'engage à ne pas divulguer les informations confidentielles de l'association.
                </p>
                <p>
                    7.3 L'employé(e) s'engage à ne pas exercer d'activité concurrente à celle de l'association pendant la durée 
                    du contrat et pendant une période de deux ans après la fin du contrat.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 8 : Régime Horaire</div>
                <p>L'employé(e) aura un régime horaire de 40 heures par semaine, réparties selon les besoins de l'association.</p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 9 : Transfert des Engagements</div>
                <p>
                    Il est expressément convenu entre les parties que les engagements et obligations émanant de 
                    ce contrat pourraient être transférés d'une manière globale et indissociable, en prenant en 
                    considération la date d'effet et l'ancienneté naissant à travers ce contrat, vers une nouvelle 
                    entité de l'organisation.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 10 : Attribution de compétence</div>
                <p>
                    Tout litige découlant du contenu du présent contrat sera résolu en vertu du droit 
                    tunisien et du ressort exclusif des tribunaux de Gabès seuls compétents.
                </p>
            </div>
            
            <p>Fait en deux exemplaires originaux, dont un pour chacune des parties.</p>
            
            <p>À ${signaturePlace || "Gabès"}, le ${
        signatureDate ? formatDate(signatureDate) : "__/__/____"
      }</p>
            
            <div class="signatures">
                <div class="signature-block">
                    <div class="signature-title">L'EMPLOYEUR</div>
                    <div class="signature-name">Association Danseurs Citoyens Sud<br>Aymen Goubaa</div>
                </div>
                
                <div class="signature-block">
                    <div class="signature-title">L'EMPLOYÉ(E)</div>
                    <div class="signature-name">${
                      employeeName || "_________"
                    }</div>
                </div>
            </div>
        </div>
      `;
    } else if (selectedContractType === "prestation") {
      // Contrat de prestation
      contractHTML = `
        ${contractHeader}
        
        <div class="contract-content">
            <div class="article">
                <div class="article-title">Article 1 : Objet du contrat</div>
                <p>
                    Le présent contrat a pour objet de définir les conditions dans lesquelles le prestataire s'engage à fournir 
                    au client les prestations de services décrites ci-après.
                </p>
                <p>
                    Le prestataire, ${
                      employeeName
                        ? `Madame/Monsieur ${employeeName}`
                        : "Madame/Monsieur _________"
                    }, 
                    s'engage à fournir au client des prestations de ${
                      prestationType === "formation"
                        ? "formation"
                        : prestationType === "consultation"
                        ? "consultation"
                        : prestationType === "evenement"
                        ? "organisation d'événement"
                        : "services"
                    } en qualité de <strong>${position || "_________"}</strong>.
                </p>
                <p>Ces prestations comprennent notamment :</p>
                <ul class="tasks-list">
                    ${
                      tasks.length > 0
                        ? tasks.map((task) => `<li>${task}</li>`).join("")
                        : "<li>Tâche à définir</li>"
                    }
                </ul>
            </div>
            
            <div class="article">
                <div class="article-title">Article 2 : Durée du contrat</div>
                <p>
                    Le présent contrat est conclu pour une durée déterminée du 
                    ${
                      prestationStartDate
                        ? formatDate(prestationStartDate)
                        : "__/__/____"
                    } au 
                    ${
                      prestationEndDate
                        ? formatDate(prestationEndDate)
                        : "__/__/____"
                    }.
                </p>
                <p>
                    Il pourra être renouvelé par accord écrit entre les parties.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 3 : Conditions financières</div>
                <p>
                    3.1 En contrepartie des prestations fournies, le client versera au prestataire la somme forfaitaire de 
                    ${prestationAmount || "___"} dinars tunisien (${
        prestationAmount
          ? numberToWords(Number.parseInt(prestationAmount))
          : "___"
      } Dinars Tunisien).
                </p>
                <p>
                    3.2 Les modalités de paiement sont les suivantes :
                </p>
                <ul>
                    <li>30% à la signature du contrat</li>
                    <li>40% à mi-parcours de la prestation</li>
                    <li>30% à la fin de la prestation, après validation par le client</li>
                </ul>
                <p>
                    3.3 Les paiements seront effectués par virement bancaire ou par chèque à l'ordre du prestataire.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 4 : Obligations du prestataire</div>
                <p>
                    4.1 Le prestataire s'engage à exécuter les prestations avec tout le soin et la diligence nécessaires, 
                    conformément aux règles de l'art et aux meilleures pratiques de sa profession.
                </p>
                <p>
                    4.2 Le prestataire s'engage à respecter les délais convenus pour la réalisation des prestations.
                </p>
                <p>
                    4.3 Le prestataire s'engage à respecter la confidentialité des informations qui lui seront communiquées 
                    par le client dans le cadre de l'exécution du présent contrat.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 5 : Obligations du client</div>
                <p>
                    5.1 Le client s'engage à fournir au prestataire toutes les informations et tous les documents nécessaires 
                    à la bonne exécution des prestations.
                </p>
                <p>
                    5.2 Le client s'engage à régler les sommes dues au prestataire dans les délais convenus.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 6 : Propriété intellectuelle</div>
                <p>
                    6.1 Tous les documents, rapports, études et créations réalisés par le prestataire dans le cadre du 
                    présent contrat sont la propriété exclusive du client, qui pourra les utiliser librement.
                </p>
                <p>
                    6.2 Le prestataire cède au client, à titre exclusif, l'ensemble des droits de propriété intellectuelle 
                    sur les œuvres créées dans le cadre du présent contrat.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 7 : Résiliation</div>
                <p>
                    7.1 En cas de manquement par l'une des parties à l'une quelconque de ses obligations, l'autre partie 
                    pourra résilier le présent contrat après mise en demeure restée sans effet pendant un délai de 15 jours.
                </p>
                <p>
                    7.2 En cas de résiliation anticipée du contrat, le prestataire sera rémunéré au prorata des prestations 
                    effectivement réalisées à la date de résiliation.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 8 : Indépendance des parties</div>
                <p>
                    Les parties reconnaissent agir chacune pour leur propre compte comme des parties indépendantes l'une 
                    de l'autre. Le présent contrat ne constitue ni une association, ni une franchise, ni un mandat donné 
                    par l'une des parties à l'autre. Aucune des parties ne peut prendre d'engagement au nom et pour le 
                    compte de l'autre partie.
                </p>
            </div>
            
            <div class="article">
                <div class="article-title">Article 9 : Attribution de compétence</div>
                <p>
                    Tout litige découlant du contenu du présent contrat sera résolu en vertu du droit 
                    tunisien et du ressort exclusif des tribunaux de Gabès seuls compétents.
                </p>
            </div>
            
            <p>Fait en deux exemplaires originaux, dont un pour chacune des parties.</p>
            
            <p>À ${signaturePlace || "Gabès"}, le ${
        signatureDate ? formatDate(signatureDate) : "__/__/____"
      }</p>
            
            <div class="signatures">
                <div class="signature-block">
                    <div class="signature-title">LE CLIENT</div>
                    <div class="signature-name">Association Danseurs Citoyens Sud<br>Aymen Goubaa</div>
                </div>
                
                <div class="signature-block">
                    <div class="signature-title">LE PRESTATAIRE</div>
                    <div class="signature-name">${
                      employeeName || "_________"
                    }</div>
                </div>
            </div>
        </div>
      `;
    }

    // Mettre à jour la prévisualisation
    contractPreview.innerHTML = contractHTML;
  }

  // Fonction pour générer la prévisualisation de l'ordre de mission
  function generateMissionPreview() {
    // Récupérer les personnes concernées
    const personDivs = document.querySelectorAll(".mission-person");
    const persons = Array.from(personDivs).map((div) => {
      return {
        name: div.querySelector(".person-name").value || "___________",
        cin: div.querySelector(".person-cin").value || "___________",
        position: div.querySelector(".person-position").value || "___________",
      };
    });

    // Récupérer les autres informations
    const departurePlace =
      document.getElementById("departurePlace").value || "Gabès";
    const destinationPlace =
      document.getElementById("destinationPlace").value || "___________";
    const missionDate = document.getElementById("missionDate").value;
    const formattedDate = missionDate ? formatDate(missionDate) : "__/__/____";
    const missionObjective =
      document.getElementById("missionObjective").value || "___________";
    const eventName = document.getElementById("eventName").value || "";
    const vehicleInfo = document.getElementById("vehicleInfo").value || "";

    // Générer le HTML de l'ordre de mission
    const missionHTML = `
      <div class="contract-header">
        <div class="header-left">
          <div><strong>ASSOCIATION DANSEURS CITOYENS SUD</strong></div>
          <div>M/F: 1447474/T</div>
          <div>N° CNSS: 548790-77</div>
          <div>ADRESSE: 115 RUE MOHAMED-ALI GABÈS 6000</div>
          <div>E-MAIL: contact@dcs.org</div>
          <div>SITE WEB: https://v-dcs.org</div>
          <div>TEL: 75 824 405</div>
        </div>
        <div class="header-right">
          <img src="${dcsLogo}" alt="DCS Logo" style="width: 100px;">
        </div>
      </div>
      
      <div class="mission-header">
        Ordre De Mission
      </div>
      
      <div class="mission-intro">
        <p>Par la présente, l'Association Danseurs Citoyens Sud (DCS), dont le siège social est situé au 115, rue Mohamed Ali, 6000 Gabès, autorise à son employé :</p>
      </div>
      
      <div class="mission-persons">
        ${persons
          .map(
            (person) => `
          <div class="mission-person-item">
            <p>• Monsieur <strong>${person.name}</strong>, titulaire de la carte d'identité nationale n° ${person.cin}, résidant à Gabès et occupant le poste de ${person.position},</p>
          </div>
        `
          )
          .join("")}
      </div>
      
      <div class="mission-travel">
        <p>À effectuer un déplacement professionnel de ${departurePlace} vers ${destinationPlace}.</p>
      </div>
      
      <div class="mission-details">
        <p><strong>Date du déplacement :</strong> ${formattedDate}</p>
        <p><strong>Objectif de la mission :</strong> ${missionObjective}</p>
        ${
          eventName
            ? `<p><strong>Dans le cadre de leur participation au ${eventName}.</strong></p>`
            : ""
        }
        ${
          vehicleInfo
            ? `<p><strong>Pour ce déplacement, nos collaborateurs utilisent un véhicule de location (${vehicleInfo}).</strong></p>`
            : ""
        }
      </div>
      
      <div class="mission-expenses">
        <p><em>Les frais de déplacement seront entièrement pris en charge par l'Association Danseurs Citoyens Sud (DCS), sous réserve de la présentation des pièces justificatives et de leur conformité avec la politique interne de l'Association.</em></p>
      </div>
      
      <div class="mission-footer">
        <p>Fait à Gabès, le ${formattedDate}</p>
        
        <div class="mission-signature">
          <p><strong>Représentant de l'Association</strong></p>
        </div>
      </div>
      
      <div class="mission-contact">
        <p>M/F: 1447474/T - RNE: 0229048201</p>
        <p>Adresse: 115 Rue Mohamed Ali 6000, Gabès</p>
        <p>Adresse électronique: contact@dcs.org</p>
        <p>N° de téléphone: 75824405</p>
      </div>
    `;

    // Mettre à jour la prévisualisation
    contractPreview.innerHTML = missionHTML;
  }

  // Initialiser avec une prévisualisation vide
  generateContractPreview();

  // Vérifier si l'utilisateur est déjà connecté
  checkLoggedIn();
});
