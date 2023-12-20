"use strict";

import { users } from "./data.js";

const signup = document.querySelector(".btn__signup");
const login = document.querySelector(".btn__login");

const formSignup = document.querySelector(".signup--form");
const nameSignup = formSignup.querySelector("#name");
const emailSignup = formSignup.querySelector("#email");
const passSignup = formSignup.querySelector("#password");

const formLogin = document.querySelector(".login--form");
const btnLogin = formLogin.querySelector(".btn--login");
const emailLogin = formLogin.querySelector("#login__email");
const passwordLogin = formLogin.querySelector("#login__password");

const me = document.querySelector(".me");
const wrapper = document.querySelector(".wrapper");
const notification = wrapper.querySelector(".notify");
const model = notification.querySelector(".model");
const user = wrapper.querySelector(".user");
const profileName = user.querySelector(".name");
const btnLogout = user.querySelector(".btn__logout");

const img = document.querySelector(".profile img");
const url = document.querySelector(".profile input");

const people = document.querySelector(".people");
const peopleContainer = people.querySelector(".people__near");

// Global varibales
let currentUser;
let isFollowing;

// Events
login.addEventListener("click", function () {
  switchModels(formLogin, [formSignup]);
});

signup.addEventListener("click", function () {
  switchModels(formSignup, [formLogin]);
});

// Login
btnLogin.addEventListener("click", () => {
  handleLogin(emailLogin, passwordLogin);
});

// Logout
btnLogout.addEventListener("click", () => {
  handleLogout();
  model.classList.add("scale--0");
});

// Register
formSignup.addEventListener("submit", function (e) {
  e.preventDefault();
  validateForm(emailSignup, nameSignup, passSignup);
});

// me
profileName.addEventListener("click", function () {
  renderMe(currentUser);
});

// notifications
notification.addEventListener("click", function () {
  renderNotifications(currentUser);
});

// Update user profile
url.addEventListener("change", function (e) {
  const [file] = this.files;
  if (file) {
    setTimeout(() => (img.src = URL.createObjectURL(file)), 600);

    const curName = user.querySelector(".name").textContent.toLowerCase();
    const updateProfile = users.filter(
      (user) => user.name.toLowerCase() === curName
    );
    if (updateProfile.length < 1) return;

    // Update profile
    updateProfile.forEach(
      (updateimg) => (updateimg.profile = URL.createObjectURL(file))
    );
  }
});

// Handle login
const handleLogin = function (email, pass) {
  if (email.value === "") {
    email.classList.add("error");
    return;
  } else {
    email.classList.remove("error");
  }
  if (pass.value === "") {
    pass.classList.add("error");
    return;
  } else {
    pass.classList.remove("error");
  }
  // Delay
  setTimeout(() => {
    renderUser(email, pass);
    clearInputs([email, pass]);
  }, 700);
};

// Handle logout
const handleLogout = function () {
  me.classList.add("scale--0");
  login.classList.remove("scale--0");
  signup.classList.remove("scale--0");
  wrapper.style.display = "none";
  people.classList.add("scale--0");

  peopleContainer.innerHTML = "";
};

const dublicateNames = function () {
  nameSignup.addEventListener("input", function () {
    const checkName = users.filter((user) => user.name === nameSignup.value);
    if (checkName.length > 0) {
      formSignup.querySelector(".btn--signup").classList.add("opacity");
      return;
    } else {
      formSignup.querySelector(".btn--signup").classList.remove("opacity");
    }
  });
};

dublicateNames();

// Validate
const validateForm = function (email, name, pass) {
  if (name.value === "") {
    name.classList.add("error");
    return;
  } else {
    name.classList.remove("error");
  }

  if (email.value === "") {
    email.classList.add("error");
    return;
  } else {
    email.classList.remove("error");
  }

  if (pass.value === "") {
    pass.classList.add("error");
    return;
  } else {
    pass.classList.remove("error");
  }

  const defAvatar = "https://i.ibb.co/dbhPwHt/default.png";
  const newUser = {
    name: name.value,
    email: email.value,
    password: password.value,
    profile: defAvatar,
    followers: [],
    following: [],
    alert: false,
    notifications: [],
    requested: [],
  };

  users.push(newUser);

  // Delay
  setTimeout(() => {
    renderUser(email, pass);
    clearInputs([email, name, pass]);
  }, 500);
};

// Rendering
const renderUser = function (email, pass) {
  const current = users.filter(
    (u) => u.email === email.value && u.password === pass.value
  );
  if (current.length < 1) return;

  currentUser = current.map((cur) => cur.name).toString();

  const name = current.map((current) => current.name).toString();
  const capitalizeName = name[0].toUpperCase().concat(name.slice(1));

  // Update name
  user.querySelector(".name").textContent = capitalizeName;

  // Update profile
  const img = user.querySelector("img");
  current.forEach((current) => (img.src = current.profile));
  switchModels(user, [login, signup, formLogin, formSignup]);

  // checking notifications
  const [notificate] = users
    .filter((user) => user.name === currentUser)
    .map((u) => u.alert);

  notificate
    ? notification.querySelector("span").classList.remove("scale--0")
    : notification.querySelector("span").classList.add("scale--0");

  wrapper.style.display = "flex";

  // Update UI
  people.classList.remove("scale--0");
  peopleContainer.classList.add("animate");
  setTimeout(function () {
    peopleContainer.classList.remove("animate");

    renderPeople(users);
  }, 1500);
};

const switchModels = (cur, others) => {
  cur.classList.remove("scale--0");
  others.forEach((other) => {
    other.classList.add("scale--0");
  });
};

const clearInputs = (inputs) => {
  setTimeout(() => inputs.forEach((input) => (input.value = "")), 400);
};

// People near
const renderPeople = function (data) {
  const nearFriends = data.filter((d) => d.name !== currentUser);

  peopleContainer.innerHTML = nearFriends
    .map((d) => {
      return `<div class="form person">
              <img src="${d.profile}" alt="" />
            <div class="person__name">${d.name}</div>
              <div class="container">
                <button class="btn btn--follow scale">Follow</button>
                <button class="btn btn--decline scale">Decline</button>
              </div>
            </div>`;
    })
    .join("");

  const cards = peopleContainer.querySelectorAll(".person");
  if (cards.length > 2) peopleContainer.style.justifyContent = "unset";

  cards.forEach((card) => {
    const btnFollow = card.querySelector(".btn--follow");
    const btnDecline = card.querySelector(".btn--decline");

    const uname = card.querySelector(".person__name").textContent;

    const [iRequested] = users
      .filter((user) => user.name === currentUser)
      .map((u) => u.requested);

    // requested already?
    if (iRequested.includes(uname)) {
      card.querySelector(".btn--follow").textContent = "Requested";
      disableBtns([btnDecline, btnFollow]);
    }

    const [isRequested] = users
      .filter((user) => user.name === currentUser)
      .map((u) => u.notifications);

    // is requested?
    if (isRequested.includes(uname)) {
      card.querySelector(".btn--follow").textContent = "Accept";
    }

    const [isFriend] = users
      .filter((user) => user.name === currentUser)
      .map((u) => u.followers);

    // is friend
    if (isFriend.includes(uname)) {
      card.querySelector(".btn--follow").textContent = "Friends";
      disableBtns([btnDecline, btnFollow]);
    }
    btnFollow.addEventListener("click", function () {
      const name = card.querySelector(".person__name").textContent;

      if (btnFollow.textContent === "Accept") {
        // update followers
        users
          .filter((user) => user.name === currentUser)
          .map((u) => {
            // update currentUser following,followers
            u.followers.push(name);
            u.following.push(name);

            if (u.notifications.indexOf(name) > -1)
              u.notifications.splice(u.notifications.indexOf(name), 1);

            if (u.notifications.length < 1) {
              u.alert = false;
              u.notifications = [];
              setTimeout(
                () =>
                  notification.querySelector("span").classList.add("scale--0"),
                250
              );
              model.classList.add("scale--0");
            }
            return;
          });

        // update the following AND the followers of the requested person
        users
          .filter((user) => user.name === name)
          .map((u) => {
            u.following.push(currentUser);
            u.followers.push(currentUser);
          });

        disableBtns([btnFollow, btnDecline]);
        return;
      }

      // update requests
      users
        .filter((user) => user.name === currentUser)
        .map((u) => u.requested.push(name));

      // users.
      notify(name);
      disableBtns([btnFollow, btnDecline]);
    });

    btnDecline.addEventListener("click", function () {
      disableBtns([btnFollow, btnDecline]);
    });
  });
};

const disableBtns = function (btns) {
  btns.forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("opacity");
  });
};

const notify = function (receiverName) {
  users
    .filter((user) => user.name === receiverName)
    .map((u) => {
      u.alert = true;
      u.notifications.push(currentUser);
    });
};

// Render notifications
const renderNotifications = function (cur) {
  model.innerHTML = users
    .filter((user) => user.name === cur)
    .map((u) => {
      return u.notifications
        .map((noti) => {
          return `<p>
                   <strong>${noti}</strong>
                   Sent you a friend request.
                </p>`;
        })
        .join("");
    });
  if (model.innerHTML === "") return;
  model.classList.toggle("scale--0");
};

// Render me
const renderMe = function (name) {
  me.innerHTML = users
    .filter((u) => u.name === name)
    .map((user) => {
      return ` <img src="${user.profile}" alt="" />
              <div class="container">
                <div class="followers">
                  <p>${user.followers.length}</p>
                  <p>Followers</p>
                </div>
                <div class="following">
                  <p>${user.following.length}</p>
                  <p>Following</p>
                </div>
              </div>`;
    })
    .join("");
  me.classList.toggle("scale--0");
};
