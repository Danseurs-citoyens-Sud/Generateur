document.addEventListener("DOMContentLoaded", () => {
  // Tab Navigation
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      const tabId = button.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Form Validation and Submission
  const form = document.getElementById("organizationalForm")

  // Validation function
  window.validateForm = () => {
    // Check all radio button groups
    const radioGroups = [
      "vision",
      "goals",
      "strategic_plan",
      "program_alignment",
      "program_planning",
      "program_inclusion",
      "program_evaluation",
      "data_collection",
      "evaluation_impact",
      "sector_communication",
      "partnerships",
      "board",
      "policies",
      "funding_sustainability",
      "financial_management",
      "organizational_structure",
      "hr_management",
      "organizational_values",
      "work_environment",
      "leadership_effectiveness",
      "succession_planning",
    ]

    let isValid = true
    let firstInvalidSection = null

    // Check each radio group
    for (const group of radioGroups) {
      const radios = document.querySelectorAll(`input[name="${group}"]`)
      const checked = Array.from(radios).some((radio) => radio.checked)

      if (!checked) {
        isValid = false

        // Find the section containing this radio group
        const section = radios[0].closest(".tab-content")
        if (!firstInvalidSection) {
          firstInvalidSection = section
        }

        // Add error styling
        const assessmentItem = radios[0].closest(".assessment-item")
        assessmentItem.classList.add("error")
      }
    }

    // Check required textareas in priorities section
    const requiredTextareas = [
      "priority1_description",
      "priority1_results",
      "priority1_steps",
      "priority1_support",
      "priority2_description",
      "priority2_results",
      "priority2_steps",
      "priority2_support",
      "priority3_description",
      "priority3_results",
      "priority3_steps",
      "priority3_support",
    ]

    for (const textareaName of requiredTextareas) {
      const textarea = document.querySelector(`textarea[name="${textareaName}"]`)
      if (!textarea.value.trim()) {
        isValid = false

        if (!firstInvalidSection) {
          firstInvalidSection = document.getElementById("priorities")
        }

        textarea.classList.add("error")
      } else {
        textarea.classList.remove("error")
      }
    }

    // If form is not valid, show error message and switch to first invalid section
    if (!isValid) {
      alert("يرجى ملء جميع الحقول المطلوبة قبل إرسال النموذج")

      // Switch to the first section with errors
      if (firstInvalidSection) {
        const sectionId = firstInvalidSection.id

        // Activate the corresponding tab
        const tabButtons = document.querySelectorAll(".tab-btn")
        const tabContents = document.querySelectorAll(".tab-content")

        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))

        document.querySelector(`.tab-btn[data-tab="${sectionId}"]`).classList.add("active")
        firstInvalidSection.classList.add("active")
      }

      return false
    }

    // Préparer les données pour Formspree avec des noms en arabe
    const formData = new FormData()

    // 1. Informations de l'organisation (toujours en premier)
    const orgName = document.getElementById("organization_name").value
    const assessmentDate = new Date().toISOString().split("T")[0]
    formData.append("01_اسم_المؤسسة", orgName)
    formData.append("02_تاريخ_التقييم", assessmentDate)

    // 2. Section 1: الرسالة والاستراتيجية
    if (document.querySelector('input[name="vision"]:checked')) {
      const visionValue = document.querySelector('input[name="vision"]:checked').value
      const visionLabel = document.querySelector(`label[for="vision-${visionValue}"]`).textContent
      formData.append("03_س1_الرؤية_والرسالة", `${visionLabel} (${visionValue})`)
    }

    if (document.querySelector('input[name="goals"]:checked')) {
      const goalsValue = document.querySelector('input[name="goals"]:checked').value
      const goalsLabel = document.querySelector(`label[for="goals-${goalsValue}"]`).textContent
      formData.append("04_س1_الأهداف_والنتائج", `${goalsLabel} (${goalsValue})`)
    }

    if (document.querySelector('input[name="strategic_plan"]:checked')) {
      const strategicValue = document.querySelector('input[name="strategic_plan"]:checked').value
      const strategicLabel = document.querySelector(`label[for="strategic-${strategicValue}"]`).textContent
      formData.append("05_س1_الخطة_الاستراتيجية", `${strategicLabel} (${strategicValue})`)
    }

    const section1Notes = document.querySelector('textarea[name="section1_notes"]').value
    formData.append("06_س1_ملاحظات", section1Notes)

    // 3. Section 2: البرامج والمشاريع
    if (document.querySelector('input[name="program_alignment"]:checked')) {
      const alignmentValue = document.querySelector('input[name="program_alignment"]:checked').value
      const alignmentLabel = document.querySelector(`label[for="alignment-${alignmentValue}"]`).textContent
      formData.append("07_س2_اتساق_البرامج_مع_الرسالة", `${alignmentLabel} (${alignmentValue})`)
    }

    if (document.querySelector('input[name="program_planning"]:checked')) {
      const planningValue = document.querySelector('input[name="program_planning"]:checked').value
      const planningLabel = document.querySelector(`label[for="planning-${planningValue}"]`).textContent
      formData.append("08_س2_تخطيط_البرامج", `${planningLabel} (${planningValue})`)
    }

    if (document.querySelector('input[name="program_inclusion"]:checked')) {
      const inclusionValue = document.querySelector('input[name="program_inclusion"]:checked').value
      const inclusionLabel = document.querySelector(`label[for="inclusion-${inclusionValue}"]`).textContent
      formData.append("09_س2_إشراك_الفئات_المهمشة", `${inclusionLabel} (${inclusionValue})`)
    }

    const section2Notes = document.querySelector('textarea[name="section2_notes"]').value
    formData.append("10_س2_ملاحظات", section2Notes)

    // 4. Section 3: التعلم والتقييم
    if (document.querySelector('input[name="program_evaluation"]:checked')) {
      const evaluationValue = document.querySelector('input[name="program_evaluation"]:checked').value
      const evaluationLabel = document.querySelector(`label[for="evaluation-${evaluationValue}"]`).textContent
      formData.append("11_س3_تقييم_البرامج", `${evaluationLabel} (${evaluationValue})`)
    }

    if (document.querySelector('input[name="data_collection"]:checked')) {
      const dataValue = document.querySelector('input[name="data_collection"]:checked').value
      const dataLabel = document.querySelector(`label[for="data-${dataValue}"]`).textContent
      formData.append("12_س3_جمع_وتحليل_المعلومات", `${dataLabel} (${dataValue})`)
    }

    if (document.querySelector('input[name="evaluation_impact"]:checked')) {
      const impactValue = document.querySelector('input[name="evaluation_impact"]:checked').value
      const impactLabel = document.querySelector(`label[for="impact-${impactValue}"]`).textContent
      formData.append("13_س3_أثر_التقييم_على_المؤسسة", `${impactLabel} (${impactValue})`)
    }

    const section3Notes = document.querySelector('textarea[name="section3_notes"]').value
    formData.append("14_س3_ملاحظات", section3Notes)

    // 5. Section 4: إشراك القطاع
    if (document.querySelector('input[name="sector_communication"]:checked')) {
      const sectorCommValue = document.querySelector('input[name="sector_communication"]:checked').value
      const sectorCommLabel = document.querySelector(`label[for="sector-comm-${sectorCommValue}"]`).textContent
      formData.append("15_س4_التواصل_مع_المؤسسات_الأخرى", `${sectorCommLabel} (${sectorCommValue})`)
    }

    if (document.querySelector('input[name="partnerships"]:checked')) {
      const partnershipsValue = document.querySelector('input[name="partnerships"]:checked').value
      const partnershipsLabel = document.querySelector(`label[for="partnerships-${partnershipsValue}"]`).textContent
      formData.append("16_س4_بناء_الشراكات", `${partnershipsLabel} (${partnershipsValue})`)
    }

    const section4Notes = document.querySelector('textarea[name="section4_notes"]').value
    formData.append("17_س4_ملاحظات", section4Notes)

    // 6. Section 5: الحوكمة
    if (document.querySelector('input[name="board"]:checked')) {
      const boardValue = document.querySelector('input[name="board"]:checked').value
      const boardLabel = document.querySelector(`label[for="board-${boardValue}"]`).textContent
      formData.append("18_س5_مجلس_الإدارة", `${boardLabel} (${boardValue})`)
    }

    if (document.querySelector('input[name="policies"]:checked')) {
      const policiesValue = document.querySelector('input[name="policies"]:checked').value
      const policiesLabel = document.querySelector(`label[for="policies-${policiesValue}"]`).textContent
      formData.append("19_س5_السياسات_والإجراءات", `${policiesLabel} (${policiesValue})`)
    }

    const section5Notes = document.querySelector('textarea[name="section5_notes"]').value
    formData.append("20_س5_ملاحظات", section5Notes)

    // 7. Section 6: التمويل
    if (document.querySelector('input[name="funding_sustainability"]:checked')) {
      const fundingValue = document.querySelector('input[name="funding_sustainability"]:checked').value
      const fundingLabel = document.querySelector(`label[for="funding-${fundingValue}"]`).textContent
      formData.append("21_س6_استدامة_التمويل", `${fundingLabel} (${fundingValue})`)
    }

    if (document.querySelector('input[name="financial_management"]:checked')) {
      const financialValue = document.querySelector('input[name="financial_management"]:checked').value
      const financialLabel = document.querySelector(`label[for="financial-${financialValue}"]`).textContent
      formData.append("22_س6_الإدارة_المالية", `${financialLabel} (${financialValue})`)
    }

    const section6Notes = document.querySelector('textarea[name="section6_notes"]').value
    formData.append("23_س6_ملاحظات", section6Notes)

    // 8. Section 7: الإدارة
    if (document.querySelector('input[name="organizational_structure"]:checked')) {
      const structureValue = document.querySelector('input[name="organizational_structure"]:checked').value
      const structureLabel = document.querySelector(`label[for="structure-${structureValue}"]`).textContent
      formData.append("24_س7_الهيكل_التنظيمي", `${structureLabel} (${structureValue})`)
    }

    if (document.querySelector('input[name="hr_management"]:checked')) {
      const hrValue = document.querySelector('input[name="hr_management"]:checked').value
      const hrLabel = document.querySelector(`label[for="hr-${hrValue}"]`).textContent
      formData.append("25_س7_إدارة_الموارد_البشرية", `${hrLabel} (${hrValue})`)
    }

    const section7Notes = document.querySelector('textarea[name="section7_notes"]').value
    formData.append("26_س7_ملاحظات", section7Notes)

    // 9. Section 8: الثقافة المؤسسية
    if (document.querySelector('input[name="organizational_values"]:checked')) {
      const valuesValue = document.querySelector('input[name="organizational_values"]:checked').value
      const valuesLabel = document.querySelector(`label[for="values-${valuesValue}"]`).textContent
      formData.append("27_س8_القيم_المؤسسية", `${valuesLabel} (${valuesValue})`)
    }

    if (document.querySelector('input[name="work_environment"]:checked')) {
      const environmentValue = document.querySelector('input[name="work_environment"]:checked').value
      const environmentLabel = document.querySelector(`label[for="environment-${environmentValue}"]`).textContent
      formData.append("28_س8_بيئة_العمل", `${environmentLabel} (${environmentValue})`)
    }

    const section8Notes = document.querySelector('textarea[name="section8_notes"]').value
    formData.append("29_س8_ملاحظات", section8Notes)

    // 10. Section 9: القيادة التنفيذية
    if (document.querySelector('input[name="leadership_effectiveness"]:checked')) {
      const leadershipValue = document.querySelector('input[name="leadership_effectiveness"]:checked').value
      const leadershipLabel = document.querySelector(`label[for="leadership-${leadershipValue}"]`).textContent
      formData.append("30_س9_فعالية_القيادة", `${leadershipLabel} (${leadershipValue})`)
    }

    if (document.querySelector('input[name="succession_planning"]:checked')) {
      const successionValue = document.querySelector('input[name="succession_planning"]:checked').value
      const successionLabel = document.querySelector(`label[for="succession-${successionValue}"]`).textContent
      formData.append("31_س9_التخطيط_للتعاقب_القيادي", `${successionLabel} (${successionValue})`)
    }

    const section9Notes = document.querySelector('textarea[name="section9_notes"]').value
    formData.append("32_س9_ملاحظات", section9Notes)

    // 11. Priorités
    const priority1Description = document.querySelector('textarea[name="priority1_description"]').value
    formData.append("33_الأولوية1_الوصف", priority1Description)

    const priority1Results = document.querySelector('textarea[name="priority1_results"]').value
    formData.append("34_الأولوية1_النتائج_المتوقعة", priority1Results)

    const priority1Steps = document.querySelector('textarea[name="priority1_steps"]').value
    formData.append("35_الأولوية1_خطوات_العمل", priority1Steps)

    const priority1Support = document.querySelector('textarea[name="priority1_support"]').value
    formData.append("36_الأولوية1_الدعم_المطلوب", priority1Support)

    const priority2Description = document.querySelector('textarea[name="priority2_description"]').value
    formData.append("37_الأولوية2_الوصف", priority2Description)

    const priority2Results = document.querySelector('textarea[name="priority2_results"]').value
    formData.append("38_الأولوية2_النتائج_المتوقعة", priority2Results)

    const priority2Steps = document.querySelector('textarea[name="priority2_steps"]').value
    formData.append("39_الأولوية2_خطوات_العمل", priority2Steps)

    const priority2Support = document.querySelector('textarea[name="priority2_support"]').value
    formData.append("40_الأولوية2_الدعم_المطلوب", priority2Support)

    const priority3Description = document.querySelector('textarea[name="priority3_description"]').value
    formData.append("41_الأولوية3_الوصف", priority3Description)

    const priority3Results = document.querySelector('textarea[name="priority3_results"]').value
    formData.append("42_الأولوية3_النتائج_المتوقعة", priority3Results)

    const priority3Steps = document.querySelector('textarea[name="priority3_steps"]').value
    formData.append("43_الأولوية3_خطوات_العمل", priority3Steps)

    const priority3Support = document.querySelector('textarea[name="priority3_support"]').value
    formData.append("44_الأولوية3_الدعم_المطلوب", priority3Support)

    // Submit the form to Formspree
    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("شكراً لك! تم إرسال التقييم بنجاح.")

          // Save to localStorage as a backup
          const formJson = {}
          const originalFormData = new FormData(form)
          originalFormData.forEach((value, key) => {
            formJson[key] = value
          })
          localStorage.setItem("organizationalAssessment", JSON.stringify(formJson))

          // Optional: reset form
          // form.reset();
        } else {
          alert("عذراً، حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("عذراً، حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.")
      })

    return false // Prevent default form submission
  }

  // Load saved data from localStorage if available
  const savedData = localStorage.getItem("organizationalAssessment")
  if (savedData) {
    const parsedData = JSON.parse(savedData)

    // Populate form fields with saved data
    Object.keys(parsedData).forEach((key) => {
      const field = form.elements[key]
      if (field) {
        if (field.type === "radio") {
          const radio = document.querySelector(`input[name="${key}"][value="${parsedData[key]}"]`)
          if (radio) radio.checked = true
        } else {
          field.value = parsedData[key]
        }
      }
    })
  }

  // Remove error styling when user interacts with field
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      const assessmentItem = this.closest(".assessment-item")
      if (assessmentItem) {
        assessmentItem.classList.remove("error")
      }
    })
  })

  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", function () {
      this.classList.remove("error")
    })
  })
})
