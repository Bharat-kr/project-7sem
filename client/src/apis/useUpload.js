import { useState } from 'react';
import axios from 'axios';

const useUpload = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fileUpload = async (selectedFile, name, cb) => {
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('file', selectedFile);

      const metadata = JSON.stringify({
        name: name
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0
      });
      formData.append('pinataOptions', options);

      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${process.env.PINATA_JWT}`
        }
      });
      if (res.status !== 200) throw new Error(res.msg || 'Some error occured, please try again');
      if (cb && typeof cb === 'function') cb(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, fileUpload };
};

export default useUpload;
