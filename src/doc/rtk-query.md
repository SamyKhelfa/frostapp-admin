---
# RTK Query – Introduction et Guide d’utilisation

RTK Query est un outil inclus dans **Redux Toolkit** qui permet de gérer facilement les appels API, le cache, le chargement et les erreurs dans une application React.

Il est particulièrement utile pour éviter d’écrire beaucoup de code répétitif lié aux requêtes HTTP.
---

## Prérequis

Avant d’utiliser RTK Query, il est recommandé de connaître :

- JavaScript (ES6)
- Les bases de React
- Les bases de Redux (store, reducer, provider)

---

## Installation

RTK Query fait partie de Redux Toolkit.
Il suffit donc d’installer Redux Toolkit et React-Redux.

```bash
npm install @reduxjs/toolkit react-redux
```

ou avec yarn :

```bash
yarn add @reduxjs/toolkit react-redux
```

---

## Configuration du store Redux

RTK Query fonctionne via une API que l’on connecte au store Redux.

### Exemple de store

```js
import { configureStore } from '@reduxjs/toolkit'
import { api } from './services/api'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

setupListeners(store.dispatch as any);
```

---

## Création d’une API avec RTK Query

On définit une API avec `createApi`.

### Exemple simple

```js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
    }),
  }),
});

export const { useGetPostsQuery } = api;
```

---

## Utilisation dans un composant React

RTK Query génère automatiquement des hooks.

### Exemple de composant

```js
import React from "react";
import { useGetPostsQuery } from "./services/api";

const Posts = () => {
  const { data, error, isLoading } = useGetPostsQuery();

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement</p>;

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};

export default Posts;
```

---

## Gestion automatique incluse

RTK Query gère automatiquement :

- Le cache des données
- Les états de chargement (`isLoading`)
- Les erreurs (`error`)
- Le refetch automatique
- La synchronisation des données

Sans RTK Query, tout cela devrait être codé à la main.

---

## Requêtes et mutations

- `builder.query` → pour récupérer des données (GET)
- `builder.mutation` → pour envoyer/modifier des données (POST, PUT, DELETE)

### Exemple de mutation

```js
addPost: builder.mutation({
  query: (newPost) => ({
    url: "/posts",
    method: "POST",
    body: newPost,
  }),
});
```

---

## Quand utiliser RTK Query

RTK Query est recommandé quand :

- L’application consomme une API REST ou GraphQL
- Tu veux réduire le code Redux boilerplate
- Tu veux un cache automatique et fiable

---

## Ressources utiles

- Documentation officielle Redux Toolkit
- Documentation RTK Query
- JSONPlaceholder pour tester des APIs

---

## Conclusion

RTK Query simplifie énormément la gestion des appels API dans Redux.
Pour un étudiant, c’est un excellent moyen d’apprendre Redux moderne sans se perdre dans trop de complexité.
