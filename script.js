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

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (validateForm()) {
      submitForm()
    }
  })

  // Validation function
  function validateForm() {
    // Get all radio groups
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
      "reputation",
      "board_membership",
      "board_policies",
      "board_meetings",
      "board_team_relation",
      "board_contributions",
      "annual_meeting",
      "funding_diversity",
      "funding_adequacy",
      "funding_priorities",
      "funding_team",
      "donor_relations",
      "legal_obligations",
      "organizational_structure",
      "administrative_procedures",
      "technology_systems",
      "internal_communication",
      "decision_making",
      "team_suggestions",
      "team_commitment",
      "teamwork",
      "team_wellbeing",
      "team_conflicts",
      "leadership_style",
      "financial_judgment",
      "personal_skills",
      "second_line_leadership",
      "external_reputation",
      "succession_planning",
    ]

    let isValid = true
    let firstInvalidSection = null

    // Check each radio group
    for (const group of radioGroups) {
      const radios = document.querySelectorAll(`input[name="${group}"]`)
      if (radios.length === 0) continue // Skip if group doesn't exist

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
        if (assessmentItem) {
          assessmentItem.classList.add("error")
        }
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
      if (textarea && !textarea.value.trim()) {
        isValid = false

        if (!firstInvalidSection) {
          firstInvalidSection = document.getElementById("priorities")
        }

        textarea.classList.add("error")
      } else if (textarea) {
        textarea.classList.remove("error")
      }
    }

    // Check section notes
    const sectionNotes = document.querySelectorAll('textarea[name$="_notes"]')
    sectionNotes.forEach((note) => {
      if (!note.value.trim()) {
        isValid = false
        note.classList.add("error")

        const section = note.closest(".tab-content")
        if (!firstInvalidSection && section) {
          firstInvalidSection = section
        }
      } else {
        note.classList.remove("error")
      }
    })

    // If form is not valid, show error message and switch to first invalid section
    if (!isValid) {
      alert("يرجى ملء جميع الحقول المطلوبة قبل إرسال النموذج")

      // Switch to the first section with errors
      if (firstInvalidSection) {
        const sectionId = firstInvalidSection.id

        // Activate the corresponding tab
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))

        document.querySelector(`.tab-btn[data-tab="${sectionId}"]`).classList.add("active")
        firstInvalidSection.classList.add("active")
      }
    }

    return isValid
  }

  // Form submission function
  function submitForm() {
    const formData = new FormData(form)

    // Add current date
    const currentDate = new Date().toISOString().split("T")[0]
    formData.append("assessment_date", currentDate)

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
          formData.forEach((value, key) => {
            formJson[key] = value
          })
          localStorage.setItem("organizationalAssessment", JSON.stringify(formJson))
        } else {
          alert("عذراً، حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("عذراً، حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.")
      })
  }

  // Load saved data from localStorage if available
  const savedData = localStorage.getItem("organizationalAssessment")
  if (savedData) {
    try {
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
    } catch (e) {
      console.error("Error loading saved data:", e)
    }
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
