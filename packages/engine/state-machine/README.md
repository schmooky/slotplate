# StateMachineStore
`StateMachineStore` — это универсальный класс, предназначенный для управления переходами между состояниями (фазами) в приложении или компоненте. Класс использует MobX для реактивного управления состоянием и GSAP для обработки тайм-аутов, связанных с переходами между фазами.

## Основные концепции
- **Фазы**: Фаза представляет собой конкретное состояние в машине состояний. Класс управляет переходами между этими фазами.
- **Обработчики**: Каждая фаза имеет соответствующий обработчик — функцию, которая определяет, что должно происходить при переходе в эту фазу.
- **Disposers**: Функции, которые выполняются при выходе из фазы. Это позволяет выполнять задачи очистки, такие как остановка анимаций или отмена тайм-аутов.
- **Resets**: Колбэки, которые могут сбросить фазу к её начальному состоянию.

## Параметры типа
- `T`: Представляет тип имени фазы. Должен быть строковым литеральным типом.
- `S`: Представляет тип объекта хранилища. Это может быть любой объект, который содержит состояние.

## Использование

### Конструктор
```typescript
constructor(
  store: S,
  handlers: PhaseHandlers<T, S>,
  initPhase: T,
  debug: boolean = false,
  onError?: (error: Error) => void
)
```

- **store**: Объект, содержащий состояние, который передается в каждый обработчик фазы.
- **handlers**: Объект, где каждый ключ — это имя фазы, а значение — функция, определяющая действия для этой фазы.
- **initPhase**: Начальная фаза, с которой начинается работа машины состояний при инициализации.
- **debug**: Если значение true, включает отладку в консоли для отслеживания переходов между фазами.
- **onError**: Необязательный обработчик ошибок, который вызывается при возникновении ошибки во время выполнения фазы.

### Методы
- **init()**: Инициализирует машину состояний, устанавливая её в начальную фазу (initPhase) и выполняя соответствующий обработчик.
- **phaseTimeout(timeoutSec: number, handler: SimpleHandler)**: Устанавливает тайм-аут для текущей фазы. Если тайм-аут срабатывает до изменения фазы, выполняется соответствующий обработчик.
- **addPhaseDisposer(disposer: SimpleHandler)**: Регистрирует функцию очистки, которая вызывается при завершении текущей фазы.
- **setPhaseName(phase: T)**: Устанавливает имя текущей фазы без выполнения какого-либо обработчика.
- **setNextPhase(phase: T)**: Устанавливает имя текущей фазы и выполняет соответствующий обработчик.

### Приватные методы
- **executePhase()**: Выполняет обработчик для текущей фазы. Также обрабатывает асинхронные результаты и осуществляет переход к следующей фазе.
- **disposeCurrentPhase()**: Вызывает и очищает все функции очистки (disposers) для текущей фазы, обеспечивая корректное завершение перед переходом к следующей фазе.

### Обработка ошибок
Если во время выполнения фазы происходит ошибка, она либо выбрасывается, либо передается в необязательный обработчик onError, который можно задать в конструкторе.

## Шаги по добавлению и настройке StateMachineStore
### Создание обработчиков фаз: Каждый обработчик фазы (PhaseHandler) представляет собой асинхронную функцию, которая управляет определенным этапом в игре. Например, фаза spin контролирует процесс вращения барабанов, отправку запроса на сервер и обработку ответа.

## Типы 

```typescript
export type SimpleHandler = () => void;
```
SimpleHandler - этот тип используется для функций очистки (disposers) и других простых операций, которые нужно выполнить в конкретной фазе.

```typescript
export type PhaseDisposerType = (_disposer: SimpleHandler) => void;
```
PhaseDisposerType — это тип функции, которая принимает в качестве аргумента SimpleHandler. Этот тип используется для добавления функций очистки (disposers) в список, который будет вызван при выходе из текущей фазы.

```typescript
export type PhaseTimeoutType = (_sec: number, _handler: SimpleHandler) => void;
```
PhaseTimeoutType 

PhaseHandlerOptions<S>

```typescript
export type PhaseHandlerOptions<S> = {
  store: S;
  setTimeout: PhaseTimeoutType;
  addDisposer: PhaseDisposerType;
};
```
PhaseHandlerOptions<S> — это объект, передаваемый в каждый обработчик фазы. Он содержит следующие свойства:

store: Хранилище (store), содержащее состояние, необходимое для выполнения текущей фазы.
setTimeout: Функция для установки тайм-аута в рамках текущей фазы.
addDisposer: Функция для добавления диспозеров (функций очистки), которые будут вызваны при выходе из текущей фазы.
Этот объект позволяет фазам взаимодействовать с состоянием и управлять временем выполнения и очисткой ресурсов.

```typescript
export type PhaseHandler<T extends string, S extends object> = (
  _options: PhaseHandlerOptions<S>,
) => T | Promise<T>;
```
PhaseHandler — выполняет действия для конкретной фазы и возвращает следующее состояние (фазу) либо немедленно, либо в виде Promise.

```typescript
export type PhaseHandlers<T extends string, S extends object> = Record<
  T,
  PhaseHandler<T, S>
>;
```
PhaseHandlers — это объект, где ключами являются имена фаз (T), а значениями — функции-обработчики (PhaseHandler) для каждой фазы. Этот тип представляет собой карту всех фаз и их соответствующих обработчиков.

## Добавление в игру

### Пример фазы spin:
```typescript
async function spin({
  store,
}: PhaseHandlerOptions<IRootStore>): Promise<
  Phase.Idle | Phase.Error | Phase.SpinStop
> {
  const reel = store.mediators.reel;
  const { network } = store;
    ...
  reel.start();
  store.network.spin();

  const spinRequestFinish = new Promise<void>((resolve) => {
    when(() => network.isSpinRequestFinished && reel.status === SlotStatus.Spinning, resolve);
  });
    ...
  // Обработка ошибок
  const spinRequestError = new Promise<void>((resolve) => {
    when(() => network.spinRequestStatus === RequestStatus.Error, resolve);
  });

  await Promise.race([spinRequestFinish, spinRequestError]);

  if (network.spinRequestStatus === RequestStatus.Error) return Phase.Error;
  if (network.spinRequestStatus === RequestStatus.Done) return Phase.SpinStop;
    ...
  return Phase.Idle;
}
```
### В этом примере фаза spin:

- Запускает рилы.
- Отправляет запрос на сервер для выполнения спина.
- Ждет завершения запроса или ошибки.
- Возвращает следующую фазу в зависимости от результата запроса.
- Определение обработчиков для всех фаз: Создайте объект phaseHandlers, где каждому ключу (фазе) соответствует функция-обработчик.

Пример phaseHandlers:

```typescript
const phaseHandlers: PhaseHandlers<Phase, IRootStore> = {
  [Phase.Init]: init,
  [Phase.Load]: load,
  [Phase.Info]: info,
  [Phase.Idle]: idle,
  [Phase.Spin]: spin,
  [Phase.Paylines]: paylines,
  [Phase.Gamble]: gamble,
  // Добавляйте другие фазы по необходимости
};
```
### Инициализация StateMachineStore в корневом хранилище: Внутри вашего RootStore, создается экземпляр StateMachineStore, передав объект хранилища, обработчики фаз и начальную фазу.

### Пример создания StateMachineStore в RootStore:

```typescript
class RootStore implements IRootStore {
  public gameState: StateMachineStore<Phase, IRootStore>;
    ...
  constructor() {
    this.gameState = new StateMachineStore(this, phaseHandlers, Phase.Init);

    this.gameState.init(); // Инициализация машины состояний
  }
    ...
}
```
### В этом примере RootStore:

- Создает экземпляр StateMachineStore с начальной фазой Phase.Init.
- Инициализирует машину состояний, вызывая метод init.

## Итог
### StateMachineStore управляет последовательностью фаз в игре, начиная с инициализации и заканчивая финальными состояниями. Каждая фаза обрабатывается асинхронно, что позволяет гибко реагировать на изменения и события, такие как завершение вращения рилов или получение ответа от сервера.