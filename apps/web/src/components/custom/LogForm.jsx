import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const schema = yup.object({
  skill: yup.string().oneOf(['READING', 'LISTENING', 'SPEAKING', 'WRITING']).required(),
  durationMin: yup.number().typeError('Must be a number').positive('Must be positive').integer().required(),
  logDate: yup.date().required(),
  note: yup.string().max(200),
});

const skillOptions = ['READING', 'LISTENING', 'SPEAKING', 'WRITING'];

export default function LogForm({ isOpen, setIsOpen }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      logDate: new Date()
    }
  });

  const mutation = useMutation({
    mutationFn: newLog => api.post('/logs', newLog),
    onSuccess: () => {
      queryClient.invalidateQueries(['studyLogs']);
      closeModal();
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      durationMin: Number(data.durationMin),
      logDate: data.logDate.toISOString(),
    });
  };

  function closeModal() {
    reset();
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-slate-100">
                  Add New Study Log
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Skill</label>
                    <select {...register('skill')} className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-blue-300 focus:border-blue-300">
                      {skillOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <p className="text-red-400 text-sm mt-1">{errors.skill?.message}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300">Duration (minutes)</label>
                    <input type="number" {...register('durationMin')} className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-blue-300 focus:border-blue-300" />
                    <p className="text-red-400 text-sm mt-1">{errors.durationMin?.message}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300">Date</label>
                    <Controller
                      control={control}
                      name="logDate"
                      render={({ field }) => (
                        <input
                          type="date"
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().split('T')[0] : ''}
                          className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-blue-300 focus:border-blue-300"
                        />
                      )}
                    />
                    <p className="text-red-400 text-sm mt-1">{errors.logDate?.message}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300">Note (optional)</label>
                    <textarea {...register('note')} rows="3" className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-blue-300 focus:border-blue-300"></textarea>
                    <p className="text-red-400 text-sm mt-1">{errors.note?.message}</p>
                  </div>

                  <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                    <button type="submit" disabled={mutation.isPending} className="px-4 py-2 bg-blue-300 text-slate-950 font-semibold rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50">
                      {mutation.isPending ? "Saving..." : "Save Log"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}