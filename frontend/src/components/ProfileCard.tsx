/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { User as UserIcon, Shield, MapPin, Phone, Mail, Edit, Plus, Check, Trash2 } from "lucide-react";
import { User } from "../types";
import { showToast } from "./common/Toast";

interface ProfileCardProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onLogout: () => void;
}

export function ProfileCard({ user, onUpdate, onLogout }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phoneNumber || "");
  const [address, setAddress] = useState(user.address || "");
  
  const [newAddress, setNewAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleSaveProfile = () => {
    onUpdate({
      ...user,
      username,
      email,
      phoneNumber: phone,
      address,
      savedAddresses: user.savedAddresses?.includes(address) 
        ? user.savedAddresses 
        : [...(user.savedAddresses || []), address].filter(Boolean)
    });
    setIsEditing(false);
    showToast("Profile details updated successfully!", "success");
  };

  const handleAddSavedAddress = () => {
    if (!newAddress.trim()) return;
    const currentList = user.savedAddresses || [];
    if (!currentList.includes(newAddress.trim())) {
      const updatedList = [...currentList, newAddress.trim()];
      onUpdate({
        ...user,
        savedAddresses: updatedList
      });
      showToast("New delivery address added!", "success");
    }
    setNewAddress("");
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (addrToDelete: string) => {
    const updatedList = (user.savedAddresses || []).filter(a => a !== addrToDelete);
    onUpdate({
      ...user,
      savedAddresses: updatedList
    });
    showToast("Address removed", "info");
  };

  return (
    <div id="cp-profile-card" className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-100 text-gray-800 select-none text-left">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-950 p-6 text-white flex flex-col items-center text-center space-y-3 relative">
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-white/10 backdrop-blur-md text-emerald-400 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full">
          <Shield className="w-3 h-3" />
          <span>Active</span>
        </div>

        <div className="w-20 h-20 bg-gradient-to-tr from-[#E23744] to-[#FF6838] rounded-full flex items-center justify-center font-black text-3xl text-white uppercase shadow-lg ring-4 ring-white/10">
          {user.username[0]}
        </div>

        <div>
          <h3 className="text-lg font-black tracking-tight text-white">{user.username}</h3>
          <p className="text-xs text-gray-300 font-medium">{user.email}</p>
        </div>
      </div>

      {/* Editing Form / Details Column */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
            Contact Information
          </h4>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-[#E23744] hover:text-[#D02B38] flex items-center space-x-1 transition-colors"
          >
            {isEditing ? <span>Cancel</span> : <><Edit className="w-3.5 h-3.5" /><span>Edit</span></>}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Username</label>
              <input 
                type="text" 
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#E23744] focus:bg-white font-semibold text-gray-800"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
              <input 
                type="email" 
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#E23744] focus:bg-white font-semibold text-gray-800"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone Number</label>
              <input 
                type="text" 
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#E23744] focus:bg-white font-semibold text-gray-800"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Primary Address</label>
              <textarea 
                rows={2}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#E23744] focus:bg-white font-semibold text-gray-800 resize-none"
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full bg-[#E23744] hover:bg-[#D02B38] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-xs leading-relaxed font-semibold divide-y divide-gray-100">
            <div className="flex items-center space-x-3 text-gray-600 py-1.5 pt-0">
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E23744] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Email Address</span>
                <span className="text-gray-900 font-semibold">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-600 py-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Phone Number</span>
                <span className="text-gray-900 font-semibold">{user.phoneNumber || "Not provided"}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-gray-600 py-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Default Delivery Address</span>
                <span className="font-semibold text-gray-900 leading-snug">{user.address || "No primary address set"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Addresses */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
            Saved Delivery Addresses
          </h4>
          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="text-xs font-bold text-[#E23744] hover:text-[#D02B38] flex items-center space-x-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>

        {showAddressForm && (
          <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 p-3 rounded-2xl animate-fade-in">
            <textarea
              placeholder="e.g. Flat 302, Palm Heights, Main Road..."
              rows={2}
              className="w-full text-xs p-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] resize-none font-semibold text-gray-800"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <button
              onClick={handleAddSavedAddress}
              className="bg-[#E23744] hover:bg-[#D02B38] text-white text-xs font-bold py-2 px-3 rounded-xl h-9 flex items-center shrink-0"
            >
              Save
            </button>
          </div>
        )}

        <ul className="space-y-2 max-h-44 overflow-y-auto">
          {(!user.savedAddresses || user.savedAddresses.length === 0) ? (
            <li className="text-xs text-gray-400 font-medium italic">No additional addresses saved.</li>
          ) : (
            user.savedAddresses.map((addr, idx) => (
              <li 
                key={idx} 
                className="flex items-start justify-between bg-gray-50 border border-gray-100 p-3 rounded-xl gap-2 transition-all hover:border-gray-200 group"
              >
                <div className="flex items-start space-x-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#E23744] shrink-0 mt-0.5" />
                  <span className="text-gray-700 leading-relaxed font-medium">{addr}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAddress(addr)}
                  className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Logout Row */}
      <div className="p-6">
        <button
          onClick={onLogout}
          className="w-full text-center py-3 border border-red-200 hover:border-red-600 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          Sign Out of Account
        </button>
      </div>

    </div>
  );
}
