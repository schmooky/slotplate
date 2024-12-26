# @slotplate/integration-api

## IntegrationMethods:

перечисление всех необходимых типов вызовов из внешнего API. На данный момент добавлен только AutoplayStopped, но в будущем планируется добавить остальные закомментированные типы.

## EveryMatrixMethods:

Это перечисление содержит типы вызовов, поступающих от платформы EveryMatrix.

## platformEveryMatrixMap:

Это карта, которая сопоставляет методы из EveryMatrixMethods с методами из IntegrationMethods. Она используется для унификации типов сообщений от внешнего API с теми, что используются в игре.

## IntegrationHandler:

- **listeners:** объект, содержащий типы вызовов и их соответствующие колбэки.
- **constructor:** принимает схему методов с колбэками и инициализирует слушателя сообщений из EveryMatrix через EveryMatrixListener. Также автоматически проверяет наличие всех необходимых колбэков.
- **verifyAllCallbacks:** проверяет, все ли методы из IntegrationMethods были зарегистрированы. В случае отсутствия вызывается ошибка.
- **dispatch:**: вызывает соответствующий колбэк для каждого типа метода, поступившего от API.

## In Game:

В игре мы добавляем стор IntegrationHandler. Cоздается схема интеграционных методов с использованием функции createIntegrationMethodsSchema. Эта схема передается в IntegrationHandler, который добавляет все необходимые методы и проверяет корректность их добавления.

```typescript
const createIntegrationMethodsSchema = (store: RootStore) => [
  {
    method: IntegrationMethods.AutoplayStop,
    callback: () => {
      store.autoplayStore.setAutoPlaySpinsLeft(null);
    },
  },
];

...

  const integrationMethodsSchema = createIntegrationMethodsSchema(this);
  this.integrationHandler = new IntegrationHandler(integrationMethodsSchema);

...
```
