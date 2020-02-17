import axios from "axios";

// Send a GET request to URL and return the json from the server.
export async function get(url, params, headers, options) {
  try {
    const response = await axios({
      method: "get",
      url: url,
      params,
      headers: {
        ...headers
      },
      ...options
    });
    // Success 🎉
    return response;
  } catch (error) {
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.log(error.request);
      return error.request;
    } else {
      // Something happened in setting up the request and triggered an Error
      console.log("Error", error.message);
      return error.message;
    }
  }
}

// Send a POST request to URL with json DATA and return the json from the
// server.
export async function post(url, data, headers, options) {
  try {
    const response = await axios({
      method: "post",
      url: url,
      data,
      headers: {
        ...headers
      },
      ...options
    });
    // Success 🎉
    return response;
  } catch (error) {
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.log(error.request);
      return error.request;
    } else {
      // Something happened in setting up the request and triggered an Error
      console.log("Error", error.message);
      return error.message;
    }
  }
}

// Send a PUT request to URL with json DATA and return the json from the
// server.
export async function patch(url, data, headers, options) {
  try {
    const response = await axios({
      method: "patch",
      url: url,
      data,
      headers: {
        ...headers
      },
      ...options
    });
    // Success 🎉
    return response;
  } catch (error) {
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.log(error.request);
      return error.request;
    } else {
      // Something happened in setting up the request and triggered an Error
      console.log("Error", error.message);
      return error.message;
    }
  }
}

// Send a DELETE request to URL and return the json from the server.
export async function del(url, headers, options) {
  try {
    const response = await axios({
      method: "delete",
      url: url,
      headers: {
        ...headers
      },
      ...options
    });
    // Success 🎉
    return response;
  } catch (error) {
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.log(error.request);
      return error.request;
    } else {
      // Something happened in setting up the request and triggered an Error
      console.log("Error", error.message);
      return error.message;
    }
  }
}
