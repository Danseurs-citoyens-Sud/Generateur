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

    // Les notes de section ne sont plus obligatoires
    const sectionNotes = document.querySelectorAll('textarea[name$="_notes"]')
    sectionNotes.forEach((note) => {
      // Supprimer toute classe d'erreur existante
      note.classList.remove("error")
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
      formData.append("15_س4_التعاون", `${sectorCommLabel} (${sectorCommValue})`)
    }

    if (document.querySelector('input[name="partnerships"]:checked')) {
      const partnershipsValue = document.querySelector('input[name="partnerships"]:checked').value
      const partnershipsLabel = document.querySelector(`label[for="partnerships-${partnershipsValue}"]`).textContent
      formData.append("16_س4_دور_المؤسسة_في_الحراكات", `${partnershipsLabel} (${partnershipsValue})`)
    }

    if (document.querySelector('input[name="reputation"]:checked')) {
      const reputationValue = document.querySelector('input[name="reputation"]:checked').value
      const reputationLabel = document.querySelector(`label[for="reputation-${reputationValue}"]`).textContent
      formData.append("17_س4_سمعة_المؤسسة", `${reputationLabel} (${reputationValue})`)
    }

    const section4Notes = document.querySelector('textarea[name="section4_notes"]').value
    formData.append("18_س4_ملاحظات", section4Notes)

    // 6. Section 5: الحوكمة
    if (document.querySelector('input[name="board_membership"]:checked')) {
      const boardMembershipValue = document.querySelector('input[name="board_membership"]:checked').value
      const boardMembershipLabel = document.querySelector(
        `label[for="board-membership-${boardMembershipValue}"]`,
      ).textContent
      formData.append("19_س5_عضوية_الهيئة_الإدارية", `${boardMembershipLabel} (${boardMembershipValue})`)
    }

    if (document.querySelector('input[name="board_policies"]:checked')) {
      const boardPoliciesValue = document.querySelector('input[name="board_policies"]:checked').value
      const boardPoliciesLabel = document.querySelector(`label[for="board-policies-${boardPoliciesValue}"]`).textContent
      formData.append("20_س5_سياسات_الهيئة_الإدارية", `${boardPoliciesLabel} (${boardPoliciesValue})`)
    }

    if (document.querySelector('input[name="board_meetings"]:checked')) {
      const boardMeetingsValue = document.querySelector('input[name="board_meetings"]:checked').value
      const boardMeetingsLabel = document.querySelector(`label[for="board-meetings-${boardMeetingsValue}"]`).textContent
      formData.append("21_س5_اجتماعات_الهيئة_الإدارية", `${boardMeetingsLabel} (${boardMeetingsValue})`)
    }

    if (document.querySelector('input[name="board_team_relation"]:checked')) {
      const boardTeamValue = document.querySelector('input[name="board_team_relation"]:checked').value
      const boardTeamLabel = document.querySelector(`label[for="board-team-${boardTeamValue}"]`).textContent
      formData.append("22_س5_علاقة_الهيئة_الإدارية_الفريق", `${boardTeamLabel} (${boardTeamValue})`)
    }

    if (document.querySelector('input[name="board_contributions"]:checked')) {
      const boardContributionsValue = document.querySelector('input[name="board_contributions"]:checked').value
      const boardContributionsLabel = document.querySelector(
        `label[for="board-contributions-${boardContributionsValue}"]`,
      ).textContent
      formData.append("23_س5_المساهمات", `${boardContributionsLabel} (${boardContributionsValue})`)
    }

    if (document.querySelector('input[name="annual_meeting"]:checked')) {
      const annualMeetingValue = document.querySelector('input[name="annual_meeting"]:checked').value
      const annualMeetingLabel = document.querySelector(`label[for="annual-meeting-${annualMeetingValue}"]`).textContent
      formData.append("24_س5_الاجتماع_العام_السنوي", `${annualMeetingLabel} (${annualMeetingValue})`)
    }

    const section5Notes = document.querySelector('textarea[name="section5_notes"]').value
    formData.append("25_س5_ملاحظات", section5Notes)

    // 7. Section 6: التمويل
    if (document.querySelector('input[name="funding_diversity"]:checked')) {
      const fundingDiversityValue = document.querySelector('input[name="funding_diversity"]:checked').value
      const fundingDiversityLabel = document.querySelector(
        `label[for="funding-diversity-${fundingDiversityValue}"]`,
      ).textContent
      formData.append("26_س6_تنوع_مصادر_التمويل", `${fundingDiversityLabel} (${fundingDiversityValue})`)
    }

    if (document.querySelector('input[name="funding_adequacy"]:checked')) {
      const fundingAdequacyValue = document.querySelector('input[name="funding_adequacy"]:checked').value
      const fundingAdequacyLabel = document.querySelector(
        `label[for="funding-adequacy-${fundingAdequacyValue}"]`,
      ).textContent
      formData.append("27_س6_كفاية_التمويل", `${fundingAdequacyLabel} (${fundingAdequacyValue})`)
    }

    if (document.querySelector('input[name="funding_priorities"]:checked')) {
      const fundingPrioritiesValue = document.querySelector('input[name="funding_priorities"]:checked').value
      const fundingPrioritiesLabel = document.querySelector(
        `label[for="funding-priorities-${fundingPrioritiesValue}"]`,
      ).textContent
      formData.append("28_س6_التمويل_بناءً_على_أولويات_المؤسسة", `${fundingPrioritiesLabel} (${fundingPrioritiesValue})`)
    }

    if (document.querySelector('input[name="funding_team"]:checked')) {
      const fundingTeamValue = document.querySelector('input[name="funding_team"]:checked').value
      const fundingTeamLabel = document.querySelector(`label[for="funding-team-${fundingTeamValue}"]`).textContent
      formData.append("29_س6_أعضاء_الفريق_المسؤولين_عن_التمويل", `${fundingTeamLabel} (${fundingTeamValue})`)
    }

    if (document.querySelector('input[name="donor_relations"]:checked')) {
      const donorRelationsValue = document.querySelector('input[name="donor_relations"]:checked').value
      const donorRelationsLabel = document.querySelector(
        `label[for="donor-relations-${donorRelationsValue}"]`,
      ).textContent
      formData.append("30_س6_العلاقات_مع_الجهات_المانحة", `${donorRelationsLabel} (${donorRelationsValue})`)
    }

    const section6Notes = document.querySelector('textarea[name="section6_notes"]').value
    formData.append("31_س6_ملاحظات", section6Notes)

    // 8. Section 7: الإدارة
    if (document.querySelector('input[name="legal_obligations"]:checked')) {
      const legalObligationsValue = document.querySelector('input[name="legal_obligations"]:checked').value
      const legalObligationsLabel = document.querySelector(
        `label[for="legal-obligations-${legalObligationsValue}"]`,
      ).textContent
      formData.append("32_س7_الموجبات_القانونية", `${legalObligationsLabel} (${legalObligationsValue})`)
    }

    if (document.querySelector('input[name="organizational_structure"]:checked')) {
      const orgStructureValue = document.querySelector('input[name="organizational_structure"]:checked').value
      const orgStructureLabel = document.querySelector(`label[for="org-structure-${orgStructureValue}"]`).textContent
      formData.append("33_س7_الهيكل_التنظيمي", `${orgStructureLabel} (${orgStructureValue})`)
    }

    if (document.querySelector('input[name="administrative_procedures"]:checked')) {
      const adminProceduresValue = document.querySelector('input[name="administrative_procedures"]:checked').value
      const adminProceduresLabel = document.querySelector(
        `label[for="admin-procedures-${adminProceduresValue}"]`,
      ).textContent
      formData.append("34_س7_الإجراءات_الإدارية", `${adminProceduresLabel} (${adminProceduresValue})`)
    }

    if (document.querySelector('input[name="technology_systems"]:checked')) {
      const techSystemsValue = document.querySelector('input[name="technology_systems"]:checked').value
      const techSystemsLabel = document.querySelector(`label[for="tech-systems-${techSystemsValue}"]`).textContent
      formData.append("35_س7_أنظمة_التكنولوجيا_والمعلومات", `${techSystemsLabel} (${techSystemsValue})`)
    }

    const section7Notes = document.querySelector('textarea[name="section7_notes"]').value
    formData.append("36_س7_ملاحظات", section7Notes)

    // 9. Section 8: الثقافة المؤسسية
    if (document.querySelector('input[name="internal_communication"]:checked')) {
      const internalCommValue = document.querySelector('input[name="internal_communication"]:checked').value
      const internalCommLabel = document.querySelector(`label[for="internal-comm-${internalCommValue}"]`).textContent
      formData.append("37_س8_التواصل_الداخلي", `${internalCommLabel} (${internalCommValue})`)
    }

    if (document.querySelector('input[name="decision_making"]:checked')) {
      const decisionMakingValue = document.querySelector('input[name="decision_making"]:checked').value
      const decisionMakingLabel = document.querySelector(
        `label[for="decision-making-${decisionMakingValue}"]`,
      ).textContent
      formData.append("38_س8_آلية_اتخاذ_القرارات", `${decisionMakingLabel} (${decisionMakingValue})`)
    }

    if (document.querySelector('input[name="team_suggestions"]:checked')) {
      const teamSuggestionsValue = document.querySelector('input[name="team_suggestions"]:checked').value
      const teamSuggestionsLabel = document.querySelector(
        `label[for="team-suggestions-${teamSuggestionsValue}"]`,
      ).textContent
      formData.append("39_س8_اقتراحات_أعضاء_الفريق", `${teamSuggestionsLabel} (${teamSuggestionsValue})`)
    }

    if (document.querySelector('input[name="team_commitment"]:checked')) {
      const teamCommitmentValue = document.querySelector('input[name="team_commitment"]:checked').value
      const teamCommitmentLabel = document.querySelector(
        `label[for="team-commitment-${teamCommitmentValue}"]`,
      ).textContent
      formData.append("40_س8_التزام_أعضاء_الفريق", `${teamCommitmentLabel} (${teamCommitmentValue})`)
    }

    if (document.querySelector('input[name="teamwork"]:checked')) {
      const teamworkValue = document.querySelector('input[name="teamwork"]:checked').value
      const teamworkLabel = document.querySelector(`label[for="teamwork-${teamworkValue}"]`).textContent
      formData.append("41_س8_العمل_الجماعي", `${teamworkLabel} (${teamworkValue})`)
    }

    if (document.querySelector('input[name="team_wellbeing"]:checked')) {
      const teamWellbeingValue = document.querySelector('input[name="team_wellbeing"]:checked').value
      const teamWellbeingLabel = document.querySelector(`label[for="team-wellbeing-${teamWellbeingValue}"]`).textContent
      formData.append("42_س8_رفاهية_أعضاء_الفريق", `${teamWellbeingLabel} (${teamWellbeingValue})`)
    }

    if (document.querySelector('input[name="team_conflicts"]:checked')) {
      const teamConflictsValue = document.querySelector('input[name="team_conflicts"]:checked').value
      const teamConflictsLabel = document.querySelector(`label[for="team-conflicts-${teamConflictsValue}"]`).textContent
      formData.append("43_س8_النزاعات_بين_أعضاء_الفريق", `${teamConflictsLabel} (${teamConflictsValue})`)
    }

    const section8Notes = document.querySelector('textarea[name="section8_notes"]').value
    formData.append("44_س8_ملاحظات", section8Notes)

    // 10. Section 9: القيادة التنفيذية
    if (document.querySelector('input[name="leadership_style"]:checked')) {
      const leadershipStyleValue = document.querySelector('input[name="leadership_style"]:checked').value
      const leadershipStyleLabel = document.querySelector(
        `label[for="leadership-style-${leadershipStyleValue}"]`,
      ).textContent
      formData.append("45_س9_أسلوب_نمط_الإدارة", `${leadershipStyleLabel} (${leadershipStyleValue})`)
    }

    if (document.querySelector('input[name="financial_judgment"]:checked')) {
      const financialJudgmentValue = document.querySelector('input[name="financial_judgment"]:checked').value
      const financialJudgmentLabel = document.querySelector(
        `label[for="financial-judgment-${financialJudgmentValue}"]`,
      ).textContent
      formData.append("46_س9_حسن_التقدير_في_الشؤون_المالية", `${financialJudgmentLabel} (${financialJudgmentValue})`)
    }

    if (document.querySelector('input[name="personal_skills"]:checked')) {
      const personalSkillsValue = document.querySelector('input[name="personal_skills"]:checked').value
      const personalSkillsLabel = document.querySelector(
        `label[for="personal-skills-${personalSkillsValue}"]`,
      ).textContent
      formData.append("47_س9_المهارات_الشخصية", `${personalSkillsLabel} (${personalSkillsValue})`)
    }

    if (document.querySelector('input[name="second_line_leadership"]:checked')) {
      const secondLineValue = document.querySelector('input[name="second_line_leadership"]:checked').value
      const secondLineLabel = document.querySelector(`label[for="second-line-${secondLineValue}"]`).textContent
      formData.append("48_س9_القيادة_في_الصف_الثاني", `${secondLineLabel} (${secondLineValue})`)
    }

    if (document.querySelector('input[name="external_reputation"]:checked')) {
      const externalReputationValue = document.querySelector('input[name="external_reputation"]:checked').value
      const externalReputationLabel = document.querySelector(
        `label[for="external-reputation-${externalReputationValue}"]`,
      ).textContent
      formData.append("49_س9_السمعة_الخارجية", `${externalReputationLabel} (${externalReputationValue})`)
    }

    if (document.querySelector('input[name="succession_planning"]:checked')) {
      const successionPlanningValue = document.querySelector('input[name="succession_planning"]:checked').value
      const successionPlanningLabel = document.querySelector(
        `label[for="succession-planning-${successionPlanningValue}"]`,
      ).textContent
      formData.append("50_س9_التعاقب_الإداري", `${successionPlanningLabel} (${successionPlanningValue})`)
    }

    const section9Notes = document.querySelector('textarea[name="section9_notes"]').value
    formData.append("51_س9_ملاحظات", section9Notes)

    // 11. Priorités
    const priority1Description = document.querySelector('textarea[name="priority1_description"]').value
    formData.append("52_الأولوية1_الوصف", priority1Description)

    const priority1Results = document.querySelector('textarea[name="priority1_results"]').value
    formData.append("53_الأولوية1_النتائج_المتوقعة", priority1Results)

    const priority1Steps = document.querySelector('textarea[name="priority1_steps"]').value
    formData.append("54_الأولوية1_خطوات_العمل", priority1Steps)

    const priority1Support = document.querySelector('textarea[name="priority1_support"]').value
    formData.append("55_الأولوية1_الدعم_المطلوب", priority1Support)

    const priority2Description = document.querySelector('textarea[name="priority2_description"]').value
    formData.append("56_الأولوية2_الوصف", priority2Description)

    const priority2Results = document.querySelector('textarea[name="priority2_results"]').value
    formData.append("57_الأولوية2_النتائج_المتوقعة", priority2Results)

    const priority2Steps = document.querySelector('textarea[name="priority2_steps"]').value
    formData.append("58_الأولوية2_خطوات_العمل", priority2Steps)

    const priority2Support = document.querySelector('textarea[name="priority2_support"]').value
    formData.append("59_الأولوية2_الدعم_المطلوب", priority2Support)

    const priority3Description = document.querySelector('textarea[name="priority3_description"]').value
    formData.append("60_الأولوية3_الوصف", priority3Description)

    const priority3Results = document.querySelector('textarea[name="priority3_results"]').value
    formData.append("61_الأولوية3_النتائج_المتوقعة", priority3Results)

    const priority3Steps = document.querySelector('textarea[name="priority3_steps"]').value
    formData.append("62_الأولوية3_خطوات_العمل", priority3Steps)

    const priority3Support = document.querySelector('textarea[name="priority3_support"]').value
    formData.append("63_الأولوية3_الدعم_المطلوب", priority3Support)

    // Envoyer les données à Formspree
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

          // Sauvegarder dans localStorage comme backup
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
