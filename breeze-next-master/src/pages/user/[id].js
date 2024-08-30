
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const EditUser = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${user.id}`, { name, email, password });
      alert('Usuário atualizado com sucesso!');
      router.push('/users');
    } catch (error) {
      console.error('Erro ao atualizar o usuário:', error);
    }
  };

  return (
    <div>
      <h1>Editar Usuário</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export async function getStaticPaths() {
  const res = await axios.get('/api/users');
  const users = res.data;

  const paths = users.map((user) => ({
    params: { id: user.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const res = await axios.get(`/api/users/${params.id}`);
  const user = res.data;

  return { props: { user } };
}

export default EditUser;
