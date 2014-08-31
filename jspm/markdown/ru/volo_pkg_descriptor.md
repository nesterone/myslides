### volo
package.json
```json
{
   "name": "hello-volo",
    "version": "1.2.3",
    "devDependencies": {
       "volo": "~0.3.3"
    },
    "amd": {},
    "volo": {
        "baseUrl": "scripts/lib",
        "dependencies": {
            "underscore": "github:documentcloud/underscore/1.2.3",
            "backbone": "documentcloud/backbone/0.9.0",
            "jquery": "jquery"
        },
         "ignore": [".gitignore", "test", "examples", "**/*.txt"]
    }
}
```
Публикуем
```
Просто создаем проект на GitHub
```