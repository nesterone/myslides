### NPM
package.json
```json
{
    "name": "hello-npm",
    "description": "bla bla",
    "version": "1.2.3",
    "devDependencies": {
         "grunt": "~0.4.0"
    },
    "dependencies": {
         "backbone": "~1.1.0"
    },
    "main": "main.js"
}
```
Публикуем
```bash
npm publish hello-npm
```