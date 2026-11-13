(function () {
  "use strict";

  function node(tag, text, attributes = {}) {
    const result = document.createElement(tag);
    if (text !== undefined) result.textContent = text;
    for (const [key, value] of Object.entries(attributes))
      result.setAttribute(key, value);
    return result;
  }
  function readSession(key) {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }
  function focusHost(target) {
    if (matchMedia("(max-width:40rem)").matches)
      document.querySelector("alx-assistant")?.close?.();
    target?.focus();
  }
  function clearErrors() {
    const summary = document.getElementById("error-summary");
    summary.hidden = true;
    summary.querySelector("ul").replaceChildren();
    document
      .querySelectorAll(".demo-field input,.demo-field select")
      .forEach((field) => {
        if (field.dataset.baseDescription === undefined)
          field.dataset.baseDescription =
            field.getAttribute("aria-describedby") || "";
        field.removeAttribute("aria-invalid");
        if (field.dataset.baseDescription)
          field.setAttribute("aria-describedby", field.dataset.baseDescription);
        else field.removeAttribute("aria-describedby");
      });
    document.querySelectorAll(".field-error").forEach((error) => {
      error.hidden = true;
      error.textContent = "";
    });
  }
  function showErrors(errors) {
    clearErrors();
    const summary = document.getElementById("error-summary");
    const list = summary.querySelector("ul");
    for (const [fieldId, message] of Object.entries(errors)) {
      const field = document.getElementById(fieldId);
      const inline = document.getElementById("err-" + fieldId);
      const item = node("li");
      if (field && inline) {
        inline.textContent = message;
        inline.hidden = false;
        field.setAttribute("aria-invalid", "true");
        field.setAttribute(
          "aria-describedby",
          [field.dataset.baseDescription, inline.id].filter(Boolean).join(" "),
        );
        const label = field.labels?.[0]?.textContent?.trim() || fieldId;
        const link = node("a", label + ": " + message, { href: "#" + fieldId });
        link.addEventListener("click", (event) => {
          event.preventDefault();
          focusHost(field);
        });
        item.append(link);
      } else item.textContent = message;
      list.append(item);
    }
    summary.hidden = false;
    focusHost(summary);
  }
  function showSuccess(id, text, heading) {
    clearErrors();
    const section = document.getElementById(id);
    if (text) section.querySelector("p").textContent = text;
    if (heading) section.querySelector("h2").textContent = heading;
    section.hidden = false;
    focusHost(section.querySelector("h2"));
  }
  async function request(api, path, body, token) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = "Bearer " + token;
    const response = await fetch(api + path, {
      method: body === undefined ? "GET" : "POST",
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(30000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) {
      const error = new Error("Request failed");
      error.status = response.status;
      error.errors = Array.isArray(result?.errors) ? result.errors : [];
      error.code = error.errors.find(
        (item) => item && typeof item.code === "string",
      )?.code;
      throw error;
    }
    return result.data;
  }
  const hints = {
    name: "Enter your full name (up to 80 characters).",
    email: "Enter a valid email, for example name@example.com.",
    password: "Use a password between 8 and 72 characters.",
    preferredLang: "Choose English or Amharic.",
    courseCode: "Choose an available course.",
  };
  function apiErrors(error) {
    if (error.code === "EMAIL_TAKEN")
      return {
        email: "This email is already registered. Use a different email.",
      };
    if (["COURSE_NOT_FOUND", "COURSE_NOT_ENROLLABLE"].includes(error.code))
      return {
        courseCode: "This course is unavailable. Choose another course.",
      };
    if (error.status === 400) {
      const errors = {};
      for (const item of error.errors || []) {
        const key =
          typeof item === "string"
            ? item.match(/^body\.([^.:\s]+)/)?.[1]
            : null;
        if (key && Object.hasOwn(hints, key)) errors[key] = hints[key];
      }
      if (Object.keys(errors).length) return errors;
    }
    return {
      general:
        error.status === 401
          ? "Your session has expired. Please sign in again in this tab."
          : "Something went wrong. Please try again. Your details have been kept.",
    };
  }
  function busy(form, value, message = "") {
    form.dataset.busy = String(value);
    form.querySelector('button[type="submit"]').disabled = value;
    form.querySelector(".form-status").textContent = message;
  }
  function signup(api) {
    const form = document.getElementById("signup-form");
    const password = form.elements.namedItem("password");
    const toggle = document.getElementById("toggle-password");
    toggle.addEventListener("click", () => {
      const reveal = password.type === "password";
      password.type = reveal ? "text" : "password";
      toggle.setAttribute("aria-pressed", String(reveal));
      toggle.textContent = reveal ? "Hide password" : "Show password";
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.dataset.busy === "true") return;
      const name = form.elements.namedItem("name").value.trim();
      const email = form.elements.namedItem("email");
      const language = form.elements.namedItem("preferredLang").value;
      const errors = {};
      if (!name || name.length > 80) errors.name = hints.name;
      if (!email.value.trim() || email.validity.typeMismatch)
        errors.email = hints.email;
      if (password.value.length < 8 || password.value.length > 72)
        errors.password = hints.password;
      if (!["en", "am"].includes(language))
        errors.preferredLang = hints.preferredLang;
      if (Object.keys(errors).length) {
        showErrors(errors);
        return;
      }
      clearErrors();
      busy(form, true, "Creating your demo account…");
      try {
        // Passwords go only to auth/register; never to the widget or chat.
        const data = await request(api, "/auth/register", {
          name,
          email: email.value.trim(),
          password: password.value,
          preferredLang: language,
        });
        try {
          sessionStorage.setItem("alx.token", data.token);
          sessionStorage.setItem(
            "alx.user",
            JSON.stringify({ id: data.user.id, name: data.user.name }),
          );
        } catch {
          /* Account creation still succeeds when browser storage is blocked. */
        }
        const notify = () =>
          document.querySelector("alx-assistant")?.notifyRegistered?.(data);
        if (customElements.get("alx-assistant")) notify();
        else customElements.whenDefined("alx-assistant").then(notify);
        password.value = "";
        form.hidden = true;
        showSuccess("signup-success");
      } catch (error) {
        showErrors(apiErrors(error));
      } finally {
        busy(form, false);
      }
    });
  }
  function login(api) {
    const form = document.getElementById("login-form");
    const password = form.elements.namedItem("password");
    const toggle = document.getElementById("toggle-password");
    toggle.addEventListener("click", () => {
      const reveal = password.type === "password";
      password.type = reveal ? "text" : "password";
      toggle.setAttribute("aria-pressed", String(reveal));
      toggle.textContent = reveal ? "Hide password" : "Show password";
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.dataset.busy === "true") return;
      const email = form.elements.namedItem("email");
      const errors = {};
      if (!email.value.trim() || email.validity.typeMismatch)
        errors.email = hints.email;
      if (!password.value || password.value.length > 72)
        errors.password = "Enter your existing password (up to 72 characters).";
      if (Object.keys(errors).length) {
        showErrors(errors);
        return;
      }
      clearErrors();
      busy(form, true, "Signing in…");
      try {
        // Password goes only to auth/login, never chat, speech or history.
        const data = await request(api, "/auth/login", {
          email: email.value.trim(),
          password: password.value,
        });
        try {
          sessionStorage.setItem("alx.token", data.token);
          sessionStorage.setItem(
            "alx.user",
            JSON.stringify({ id: data.user.id, name: data.user.name }),
          );
        } catch {
          /* The live widget can still retain this tab's session. */
        }
        const notify = () =>
          document.querySelector("alx-assistant")?.notifySignedIn?.(data);
        if (customElements.get("alx-assistant")) notify();
        else customElements.whenDefined("alx-assistant").then(notify);
        password.value = "";
        form.hidden = true;
        showSuccess("login-success");
      } catch (error) {
        password.value = "";
        showErrors(
          error.status === 401
            ? {
                general:
                  "The email or password is incorrect. Please try again.",
              }
            : apiErrors(error),
        );
      } finally {
        busy(form, false);
      }
    });
  }
  async function enroll(api) {
    const form = document.getElementById("enroll-form");
    const token = readSession("alx.token");
    if (!token) {
      document.getElementById("need-signin").hidden = false;
      return;
    }
    form.hidden = false;
    const select = form.elements.namedItem("courseCode");
    let courses;
    try {
      courses = (await request(api, "/courses")).filter(
        (course) => course.enrollable,
      );
      select.replaceChildren(node("option", "Choose a course", { value: "" }));
      for (const course of courses)
        select.append(node("option", course.titleEn, { value: course.code }));
      select.disabled = false;
      form.querySelector('button[type="submit"]').disabled =
        courses.length === 0;
      const requested = new URLSearchParams(location.search).get("course");
      if (requested && courses.some((course) => course.code === requested))
        select.value = requested;
      else if (requested)
        showErrors({
          courseCode:
            "That course is unavailable. Choose a course from the list.",
        });
      if (!courses.length)
        showErrors({
          courseCode: "No courses are open for enrolment right now.",
        });
    } catch (error) {
      showErrors(apiErrors(error));
      return;
    }
    const details = document.getElementById("course-details");
    const showDetails = () => {
      const course = courses.find((item) => item.code === select.value);
      details.replaceChildren();
      if (course)
        details.append(
          node("h2", course.titleEn),
          node("p", course.descriptionEn),
        );
    };
    select.addEventListener("change", showDetails);
    showDetails();
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.dataset.busy === "true") return;
      if (!courses.some((course) => course.code === select.value)) {
        showErrors({ courseCode: hints.courseCode });
        return;
      }
      clearErrors();
      busy(form, true, "Saving your enrolment…");
      try {
        await request(api, "/enrollments", { courseCode: select.value }, token);
        form.hidden = true;
        showSuccess("enroll-success", "Your demo enrolment is saved.");
      } catch (error) {
        if (error.code === "ALREADY_ENROLLED") {
          form.hidden = true;
          showSuccess(
            "enroll-success",
            "You are already enrolled in this course.",
            "Already enrolled",
          );
        } else showErrors(apiErrors(error));
      } finally {
        busy(form, false);
      }
    });
  }
  async function dashboard(api) {
    const status = document.getElementById("dashboard-status");
    let user;
    try {
      user = JSON.parse(readSession("alx.user") || "null");
    } catch {
      /* No cached name. */
    }
    if (typeof user?.name === "string")
      document.querySelector("h1").textContent = "Welcome, " + user.name;
    const token = readSession("alx.token");
    if (!token) {
      status.textContent = "";
      document.getElementById("need-signin").hidden = false;
      return;
    }
    try {
      const { enrollments } = await request(
        api,
        "/enrollments/me",
        undefined,
        token,
      );
      const list = document.getElementById("enrolments");
      list.replaceChildren();
      for (const enrollment of enrollments) {
        const { course } = enrollment;
        const item = node("li");
        item.append(node("strong", course.titleEn), node("p", course.code));
        const date = new Date(enrollment.createdAt);
        if (!Number.isNaN(date.getTime())) {
          const line = node("p", "Enrolled: ");
          line.append(
            node("time", date.toLocaleDateString(), {
              datetime: date.toISOString(),
            }),
          );
          item.append(line);
        }
        // Only mapped local course pages can become links; API strings never become arbitrary URLs.
        const destinations = {
          "pages/homepage-v1-paced.html": "homepage-v1-paced.html",
          "pages/homepage-v1-self-paced.html": "homepage-v1-self-paced.html",
          "pages/concept-with-navigation.html": "concept-with-navigation.html",
        };
        if (Object.hasOwn(destinations, course.landingPath))
          item.append(
            node("a", "Open course page: " + course.titleEn, {
              href: destinations[course.landingPath],
            }),
          );
        list.append(item);
      }
      document.getElementById("empty-enrolments").hidden =
        enrollments.length !== 0;
      status.textContent = "";
    } catch (error) {
      status.textContent = "";
      showErrors(apiErrors(error));
    }
  }
  function initialize() {
    const api = document
      .querySelector("alx-assistant")
      ?.getAttribute("api")
      ?.replace(/\/+$/, "");
    if (!api) {
      showErrors({ general: "The demo API is not configured." });
      return;
    }
    const page = document.body.dataset.page;
    if (page === "signup") signup(api);
    if (page === "login") login(api);
    if (page === "enroll") void enroll(api);
    if (page === "dashboard-demo") void dashboard(api);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
