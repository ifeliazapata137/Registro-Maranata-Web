import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import { Calendar, User, MapPin, HeartPulse, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [form, setForm] = useState({
    person_name: '',
    birth_date: '',
    mobile_number: '',
    street_address: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const updateForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!form.person_name || !form.birth_date) {
      setErrorMsg('El nombre completo y la fecha de nacimiento son obligatorios.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('birthdays').insert([{
        ...form,
        category: 'Familia',
        relationship: '',
        notes: ''
      }]);

      if (error) {
        if (error.code === '23505') {
          throw new Error('Ya existe una persona registrada con ese nombre exacto.');
        }
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al guardar los datos.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-container">
        <div className="success-card">
          <CheckCircle2 size={64} className="success-icon" />
          <h1>¡Registro Exitoso!</h1>
          <p>Tus datos han sido guardados correctamente en nuestra base de datos. ¡Gracias!</p>
          <button onClick={() => {
            setForm({ person_name: '', birth_date: '', mobile_number: '', street_address: '', emergency_contact_name: '', emergency_contact_phone: '' });
            setSuccess(false);
          }} className="btn-primary">Registrar a otra persona</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="form-card">
        <div className="form-header">
          <div className="icon-wrapper">
            <Calendar size={32} color="#1152d4" />
          </div>
          <h1>Registro de Miembros</h1>
          <p>Maranata Church Management</p>
        </div>

        {errorMsg && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <div className="section-title">
              <User size={18} />
              <span>INFORMACIÓN PERSONAL</span>
            </div>

            <div className="form-group">
              <label>Nombres y Apellidos *</label>
              <input
                type="text"
                name="person_name"
                placeholder="Ej: Pepito Pancho Pérez Juárez"
                value={form.person_name}
                onChange={updateForm}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento *</label>
              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={updateForm}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Número de Celular</label>
              <div className="phone-input">
                <span className="country-code">+593</span>
                <input
                  type="tel"
                  name="mobile_number"
                  placeholder="(099) 123-4567"
                  value={form.mobile_number}
                  onChange={updateForm}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <MapPin size={18} />
              <span>DIRECCIÓN DE RESIDENCIA</span>
            </div>
            <div className="form-group">
              <label>Dirección Completa</label>
              <textarea
                name="street_address"
                placeholder="Ej: Av. Principal 123..."
                value={form.street_address}
                onChange={updateForm}
                rows={3}
              />
            </div>
          </div>

          <div className="form-section emergency-section">
            <div className="section-title emergency-title">
              <HeartPulse size={18} />
              <span>CONTACTO DE EMERGENCIA</span>
            </div>
            <div className="form-group">
              <label>Nombre del Contacto</label>
              <input
                type="text"
                name="emergency_contact_name"
                placeholder="Ej: María Rivera"
                value={form.emergency_contact_name}
                onChange={updateForm}
              />
            </div>
            <div className="form-group">
              <label>Teléfono del Contacto</label>
              <input
                type="tel"
                name="emergency_contact_phone"
                placeholder="Ej: (098) 987-6543"
                value={form.emergency_contact_phone}
                onChange={updateForm}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary submit-btn" disabled={loading}>
            {loading ? <><Loader2 className="spinner" size={18} /> Procesando...</> : 'Guardar Datos'}
          </button>
        </form>
      </div>
    </div>
  );
}
