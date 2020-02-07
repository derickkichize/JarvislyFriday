# Jarvisly Friday
---

#### Atualizando o big data

Para atualizar o big data utilize o seguinte comando.
```console 
user@host666:~/JarvislyFriday$ npm run inpiSync
```

---
### Criando uma cron job.

primeiro vamos criar um job na pasta */app/jobs* chamado **jobs-test.js** como no exemplo abaixo:

```javascript
  module.exports = () => {
   console.log('cron sera executada!');
  }
```

Agora precisamos registrar este job no **Scheduler** que se encontra na pasta *app/providers/cron/Scheduler.js*

```javascript
  module.exports = (() => {
    // inclua o caminho do arquivo
    cron.schedule("* * * * *", require('../../jobs/job-test.js'));
  })();
```
