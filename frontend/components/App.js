import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import { axiosAuth } from "../axios/index";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/");
  };
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      setMessage("Goodbye!");
    } else {
      setMessage("Goodbye!");
    }
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axios
      .post(loginUrl, { username, password })
      .then((response) => {
        // console.log(response.data);
        localStorage.setItem("token", response.data.token);
        setMessage(response.data.message);
        redirectToArticles();
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axiosAuth()
      .get(articlesUrl)
      .then((response) => {
        // console.log(response.data);
        setArticles(response.data.articles);
        setMessage(response.data.message);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          redirectToLogin();
        } else {
          setMessage(error.response.data.message);
        }
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage("");
    setSpinnerOn(true);
    axiosAuth()
      .post(articlesUrl, article)
      .then((response) => {
        // console.log(response.data);
        setArticles([...articles, response.data.article]);
        setMessage("Well done, Foo. Great Article!");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          redirectToLogin();
        } else {
          setMessage(error.response.data.message);
        }
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage("");
    setSpinnerOn(true);
    axiosAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((response) => {
        // console.log(response.data);
        setArticles(
          articles.map((art) => {
            if (art.article_id === article_id) {
              return response.data.article;
            } else {
              return art;
            }
          })
        );
        setMessage("Nice update, Foo!");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          redirectToLogin();
        } else {
          setMessage(error.response.data.message);
        }
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const deleteArticle = (article_id) => {
    // ✨ implement

    setMessage("");
    setSpinnerOn(true);
    axiosAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((response) => {
        console.log(response.data);
        setArticles(
          articles.filter((art) => {
            return art.article_id !== article_id;
          })
        );
        setMessage(`Article ${article_id} was deleted, Foo!`);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          redirectToLogin();
        } else {
          setMessage(error.response.data.message);
        }
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  articles={articles}
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  currentArticleId={currentArticleId}
                  setCurrentArticleId={setCurrentArticleId}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
