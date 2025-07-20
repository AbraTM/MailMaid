# 📬 Mail Maid

**Mail Maid** is an advanced email management platform that intelligently classifies and bulk-manages emails often missed by traditional spam filters. Built with the MERN stack and a Python-based machine learning microservice, the platform helps users regain control of cluttered inboxes.

Unlike typical spam filters, Mail Maid focuses on **ephemeral or semi-relevant emails** — messages like order confirmations, sign-in alerts, and promotional emails that were briefly useful but now simply take up space.

---

##  What It Does

Trained on ~2,500 of my own Gmail emails, Mail Maid connects to your Gmail account and:

-  **Fetches Emails** via the Gmail API  
-  **Classifies Messages** using a hybrid pipeline:
  - **Weak Labeling (Fuzzy Logic)**: Uses [`Rapidfuzz`](https://github.com/maxbachmann/RapidFuzz) to assign soft categories such as `Food Orders`, `Promotions`, `Social Media`, and `Sign-in Alerts`.
  - **Refinement (Logistic Regression)**: Applies `scikit-learn`'s Logistic Regression on TF-IDF embeddings to refine the predictions with supervised learning.
-  **Enables Bulk Actions** for intelligent email cleanup and management
-  **Runs Fully Containerized**: Uses Docker Compose to coordinate the React frontend, Node.js backend, and Flask ML service

> The goal is to help users reclaim their inbox from messages that mattered once, but no longer do — and to do it intelligently, at scale.

---

## 🛠️ Tech Stack

| Layer            | Technologies Used                                              |
|------------------|----------------------------------------------------------------|
| Frontend         | ReactJS, React Router                                          |
| Backend          | Node.js, Express, MongoDB                                      |
| ML Microservice  | Flask, Python, scikit-learn, TF-IDF, Rapidfuzz (Fuzzy Logic)   |
| DevOps           | Docker, Docker Compose                                         |
| APIs             | Gmail API                                                      |
| Deployment       | [Vercel](https://vercel.com/) (Frontend), [Render](https://render.com/) (Backend & ML Service) |

---

## 🧠 Machine Learning Pipeline

Mail Maid’s classification system combines heuristic logic with traditional ML:

- **Weak Labeling (Fuzzy Logic)**  
  Utilizes `Rapidfuzz` to heuristically assign probabilistic, soft labels to incoming emails. Example categories:
  - `Food Orders`
  - `Sign-in Alerts`
  - `Social Media`
  - `Promotions`
  
  This replaces rigid `if-else` conditions with more flexible fuzzy scoring based on similarity and context.

- **Refinement (Logistic Regression)**  
  Once labeled, emails are vectorized using TF-IDF embeddings and passed into a `Logistic Regression` classifier built with `scikit-learn`. This supervised model refines the weak labels for improved generalization and accuracy.

---

##  Model Development Log

| Phase      | Methodology                                                            | Purpose/Outcome                                                                 |
|------------|------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| Phase 1    | `if-else` rules → TF-IDF → Logistic Regression                         | Handwritten rules generated weak labels; model trained on top to predict future categories. |
| Phase 2    | Fuzzy Logic (`Rapidfuzz`) → TF-IDF → Logistic Regression               | Replaced rules with probabilistic fuzzy labels; model retrained on better-quality data. |
| Planned    | LLM-based Weak Labeling → Transformer models (e.g., BERT, DistilBERT)  | Use LLMs for richer weak labels; explore Transformers for deeper semantic classification. |

---

## 🌐 Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com/)  
- **Backend & ML Service**: Deployed via [Render](https://render.com/)

> All services are also fully containerized for local development using Docker Compose.

---

##  Future Plans

- **Batch Fetching from Gmail**  
  Gmail’s API allows only 500 messages per request. To improve performance, I plan to implement **batch fetching** and pagination strategies to speed up initial data retrieval.

- **Batch Classification in ML Pipeline**  
  Explore batch-processing incoming emails for classification rather than processing them one-by-one — potentially reducing model inference time and improving user experience.

- **Smart Relabeling**  
  Add a feedback loop to allow users to relabel incorrect classifications and retrain the model accordingly.

- **LLM-Enhanced Labeling**  
  Integrate Large Language Models (LLMs) like GPT to generate more context-aware weak labels and support edge cases.

---

##  Summary

Mail Maid is not just another spam filter — it’s a smarter inbox assistant. It targets the *gray area* of emails: useful once, useless later. With modular architecture, containerized services, and an evolving ML pipeline, it’s built for extensibility and automation.

---

