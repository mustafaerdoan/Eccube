import { useState, useEffect } from 'react'
import { useMemo } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import Avatar from './Avatar'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'



export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [name,setName]=useState(null)

/*   GOOGLE MAPS API
  const mapStyles = {
    width: '100%',
    height: '100%'
  };
  const center = {
    lat: -3.745,
    lng: -38.523
  };
  const onLoad =useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])
*/ 
  const [vorname,setVorname]=useState(null)
  const [adress,setAdress]=useState(null)
  const [hausnummer,setHausNummer]=useState(null)
  const [postleitzahl,setPostleitzahl]=useState(null)
  const [telFest,setFest]=useState(null)
  const [Mobil,setMobil]=useState(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const[stadt,setStadt]= useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [map, setMap] =useState(null)
  const professions = ['Servicecraft', 'Electrician', 'Plumber', 'Carpenter']
  const [profession, setProfession] = useState(null)

  useEffect(() => {

    getProfile()
  }, [session])

  async function getProfile() {
   
    try {
      setLoading(true)
      
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username,vorname,name,adress,hausnummer,postleitzahl,stadt,Mobil,telFest, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setVorname(data.vorname)
        setName(data.name)
        setAdress(data.adress)
        setHausNummer(data.hausnummer)
        setPostleitzahl(data.postleitzahl)
        setWebsite(data.website)
        setMobil(data.Mobil)
        setStadt(data.stadt)
        setFest(data.telFest)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username,vorname,name,adress,hausnummer,postleitzahl,stadt,Mobil,telFest, website, avatar_url }) {
    try {
      setLoading(true)
      isLoaded(true)
      const updates = {
        id: user.id,
        username,
        vorname,
        name,
        adress,
        hausnummer,
        postleitzahl,
        stadt,
        Mobil,
        telFest,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
        
      };
      
      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      
      <span>
      Wir benötigen Ihr(e) Dokument(e), um Ihr Unternehmen zu verifizieren(Handswerkskarte,Gewerbeschein,Handelsregisterauszug)
      </span>
      <br />
      <Avatar
      uid={user.id}
      url={avatar_url}
      size={150}
      onUpload={(url) => {
        setAvatarUrl(url)
        updateProfile({ username,vorname,name,adress,hausnummer,postleitzahl,stadt,Mobil,telFest, website, avatar_url: url })
      }}
    ></Avatar>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
        <label htmlFor="vorname">Vorname</label>
        <input
          id="vorname"
          type="text"
          value={vorname || ''}
          onChange={(e) => setVorname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="name">name</label>
        <input
          id="name"
          type="text"
          value={name || ''}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
      <form>
      <label htmlFor="profession">What is your profession?</label>
      <select id="profession" value={profession} onChange={(e)=> setProfession(e.target.value)}>
        <option value="">Select a profession</option>
        {professions.map((profession) => (
          <option key={profession} value={profession}>
            {profession}
          </option>
        ))}
      </select>
      </form>
      </div>
      <form>
      <div id="map">
      </div>
      </form>
      <div>
        <label htmlFor="adress">Adress</label>
        <input
          id="adress"
          type="text"
          value={adress || ''}
          onChange={(e) => setAdress(e.target.value)}
        />
        
      <div>
        <label htmlFor="hausnummer">Hausnummer</label>
        <input
          id="hausnummer"
          type="hausnummer"
          value={hausnummer || ''}
          onChange={(e) => setHausNummer(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="postleitzahl">Postleitzahl</label>
        <input
          id="postleitzahl"
          type="postleitzahl"
          value={postleitzahl || ''}
          onChange={(e) => setPostleitzahl(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="stadt">Stadt</label>
        <input
          id="stadt"
          type="stadt"
          value={stadt || ''}
          onChange={(e) => setStadt(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="Mobil">Mobilnummer</label>
        <input
          id="Mobil"
          type="Mobil"
          value={Mobil || ''}
          onChange={(e) => setMobil(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="telfest">Telfest</label>
        <input
          id="telfest"
          type="telfest"
          value={telFest || ''}
          onChange={(e) => setFest(e.target.value)}
        />
      </div>
        
  <input type="text" id="item_price" value=""></input>
      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username,vorname,name,adress,hausnummer,postleitzahl,stadt,website,Mobil,telFest, avatar_url: url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>  
    </div>
    </div>
)}