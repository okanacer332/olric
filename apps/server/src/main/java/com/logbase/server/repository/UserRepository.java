package com.logbase.server.repository;

import com.logbase.server.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * E-posta adresine göre kullanıcıyı bulur.
     * AuthService içinde login işlemi sırasında kullanıyoruz.
     * * @param email Kullanıcının e-posta adresi
     * @return Opsiyonel olarak User döner (varsa dolu, yoksa boş)
     */
    Optional<User> findByEmail(String email);

    // İPUCU: İleride "Outlook ID'sine göre kullanıcı bul" gibi bir ihtiyaç olursa
    // Spring Data MongoDB'nin "Query Method" özelliği sayesinde şöyle yazabiliriz:
    // Optional<User> findByConnectedAccountsProviderUserId(String providerUserId);
}