const handleResponse = async (response, parseResponse) => {
  const content = document.querySelector('#content');

  switch (response.status) {
    case 200:
      content.innerHTML = '<b>Success</b>';
      break;
    case 201:
      content.innerHTML = '<b>Created</b>';
      break;
    case 204:
      content.innerHTML = '<b>Updated (No Content)</b>';
      break;
    case 400:
      content.innerHTML = '<b>Bad Request</b>';
      break;
    case 404:
      content.innerHTML = '<b>Resource Not Found</b>';
      break;
    default:
      content.innerHTML = 'Error code not implemented by client.';
      break;
  }

  if (parseResponse) {
    const obj = await response.json();
    const jsonString = JSON.stringify(obj);
    content.innerHTML += `<p>${jsonString}</p>`;
  } else if (response.status !== 204) {
    content.innerHTML += '<p>Meta Data Received</p>';
  }
};

const sendPost = async (form) => {
  const action = form.getAttribute('action');
  const method = form.getAttribute('method');

  const name = form.querySelector('#nameField').value;
  const age = form.querySelector('#ageField').value;

  const formData = `name=${name}&age=${age}`;

  const response = await fetch(action, {
    method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: formData,
  });

  handleResponse(response, response.status !== 204);
};

const requestUpdate = async (form) => {
  const url = form.querySelector('#urlField').value;
  const method = form.querySelector('#methodSelect').value;

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
    },
  });

  handleResponse(response, method === 'get');
};

const init = () => {
  const userForm = document.querySelector('#userForm');
  const nameForm = document.querySelector('#nameForm');

  const getUsers = (e) => {
    e.preventDefault();
    requestUpdate(userForm);
    // Prevent event bubbling
    return false;
  };

  const addUser = (e) => {
    e.preventDefault();
    sendPost(nameForm);
    // Prevent event bubbling
    return false;
  };

  userForm.addEventListener('submit', getUsers);
  nameForm.addEventListener('submit', addUser);
};

init();
