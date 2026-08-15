# BRIQUE

Un journal BuildInPublic minimaliste, sans compte et sans backend. Les entrées sont enregistrées dans le `localStorage` du navigateur et ne quittent pas l'appareil.

## Le principe

BRIQUE commence volontairement petit. Chaque évolution doit apporter une fonction, un test, une amélioration d'accessibilité ou une documentation réellement utile. La roadmap se trouve dans [`BRIQUES.md`](./BRIQUES.md).

## Lancer le projet

Ouvrez `index.html` dans un navigateur moderne. Aucun build, paquet ou service externe n'est nécessaire.

## Socle actuel

- choix du projet ;
- saisie d'une note courte ;
- sauvegarde locale ;
- affichage antéchronologique du journal ;
- interface responsive et navigation clavier.

## Règles du chantier

1. Une seule brique cohérente par commit.
2. Pas de dépendance sans besoin démontré.
3. Pas de donnée fictive présentée comme réelle.
4. La confidentialité locale reste le comportement par défaut.
5. La simplicité passe avant la quantité de fonctionnalités.
