
# Stylebook Cli
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

A sample CLI to manage frontend-token-definition.json file

## Features

- Create frontend-token-definition.json file
- Create categories inside this file
- Create token sets
- Create token definition


## Installation

Install this cli using cli. First, clone this repo and run this.

```bash
  npm install -g .

```
    
## Usage/Examples

To generate  a new file.
```bash
  stylebook create

```

```javascript
{
    "frontendTokenCategories": []
}
```

To create a new category 

```bash
  stylebook create:category
  ? Section label? colors
```

```javascript
{
    "frontendTokenCategories": [
        {
            "name": "colors",
            "label": "colors",
            "frontendTokenSets": []
        }
    ]
}
```
## Authors

- [@rennanprysthon](https://www.github.com/rennanprysthon)


