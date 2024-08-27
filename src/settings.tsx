import { Fragment } from 'preact'
import { ChangeEvent } from 'preact/compat';
import { Dialog, Switch, Transition } from '@headlessui/react'
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

interface SettingsProps {
  minutes_per_player1: number;
  setMinutesPerPlayer1: (minutes: number) => void;
  minutes_per_player2: number;
  setMinutesPerPlayer2: (minutes: number) => void;
  different_time: boolean;
  setDifferentTime: (val: boolean) => void;
  extra_seconds: number;
  setExtraSeconds: (minutes: number) => void;
  notifications: boolean;
  setNotifications: (val: boolean) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
}
export default function Settings(props: SettingsProps) {
  const { t, i18n } = useTranslation();

  const player_2_time = (
    <div className='col-span-2 place-self-center w-full' >
      <label htmlFor="minutes2" className="block text-sm font-medium text-neutral-300">
        {t("player2-minutes-label")}
      </label>
      <div className="mt-1">
        <input
          type="number"
          name="minutes2"
          id="minutes2"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            if (event.currentTarget.value) {
              props.setMinutesPerPlayer2(parseInt(event.currentTarget.value))
            }
          }}
          value={props.minutes_per_player2}
          className="block w-full rounded-md bg-neutral-800 border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm placeholder:text-neutral-500"
          placeholder=""
        />
      </div>
    </div>
  )
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as={Fragment} onClose={props.setOpen}>
        <div className="relative z-10">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-90 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto text-neutral-100">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden bg-neutral-800 rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                  <div className="mt-3">
                    <Dialog.Title as={Fragment}>
                      <h3 className="text-xl lg:text-3xl font-medium leading-6 text-center">
                        {t('settings-title')}
                      </h3>
                    </Dialog.Title>
                    <div className="mt-6 grid gap-y-2 gap-x-4 lg:gap-x-10 grid-cols-4 justify-items-start">
                      <div className='col-span-2  w-full'>
                        <label htmlFor="minutes1" className="block text-sm font-medium text-neutral-300">
                          {props.different_time ? t("player1-minutes-label") : t("minutes-label")}
                        </label>
                      </div>
                      <div className='col-span-2  w-full'>
                        <label htmlFor="seconds" className="block text-sm font-medium text-neutral-300">
                          {t("increment-label")}
                        </label>
                      </div>
                      <div className='col-span-2 w-full'>
                        <input
                          type="number"
                          name="minutes1"
                          id="minutes1"
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            if (event.currentTarget.value) {
                              if (props.different_time) {
                                props.setMinutesPerPlayer1(parseInt(event.currentTarget.value))
                              } else {
                                props.setMinutesPerPlayer1(parseInt(event.currentTarget.value))
                                props.setMinutesPerPlayer2(parseInt(event.currentTarget.value))
                              }
                            }
                          }}
                          value={props.minutes_per_player1}
                          className="block w-full rounded-md bg-neutral-800 border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm placeholder:text-neutral-500"
                          placeholder=""
                        />
                      </div>
                      <div className='col-span-2 w-full'>
                        <input
                          type="number"
                          name="seconds"
                          id="seconds"
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            if (event.currentTarget.value) {
                              props.setExtraSeconds(parseInt(event.currentTarget.value))
                            }
                          }}
                          value={props.extra_seconds}
                          className="block w-full rounded-md bg-neutral-800 border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm placeholder:text-neutral-500"
                          placeholder=""
                        />
                      </div>
                      {props.different_time && player_2_time}
                      <Switch.Group as={Fragment}>
                        <div className="col-span-4 mt-4 flex justify-between w-full">
                          <Switch.Label as={Fragment}>
                            <span className="text-sm font-medium ">{t("different-times-label")}</span>
                          </Switch.Label>
                          <Switch
                            checked={props.different_time}
                            onChange={props.setDifferentTime}
                            className={classNames(
                              props.different_time ? 'bg-indigo-600' : 'bg-gray-200',
                              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2'
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                props.different_time ? 'translate-x-5' : 'translate-x-0',
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                              )}
                            />
                          </Switch>
                        </div>
                      </Switch.Group>
                      <Switch.Group as={Fragment}>
                        <div className="col-span-4 mt-4 flex justify-between w-full">
                          <Switch.Label as={Fragment}>
                            <div>
                              <span className="text-sm font-medium ">{t("sound-notification-label")}</span>
                              <div className="text-sm mt-1 text-gray-500">{t("sound-notification-sublabel")}</div>
                            </div>
                          </Switch.Label>
                          <Switch
                            checked={props.notifications}
                            onChange={props.setNotifications}
                            className={classNames(
                              props.notifications ? 'bg-indigo-600' : 'bg-gray-200',
                              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2'
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                props.notifications ? 'translate-x-5' : 'translate-x-0',
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                              )}
                            />
                          </Switch>
                        </div>
                      </Switch.Group>
                      <div className='hidden lg:block col-span-4 text-center px-8'>
                        {t("keyboard-instructions")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-neutral-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => props.setOpen(false)}
                    >
                      {t("done-button")}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root >
  )
}
