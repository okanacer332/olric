package com.logbase.server.repository;

import com.logbase.server.model.SmartItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface SmartItemRepository extends MongoRepository<SmartItem, String> {
    List<SmartItem> findByUserId(String userId);

    // Belirli bir kategoriyi çekmek istersek (örn: Sadece Abonelikler)
    List<SmartItem> findByUserIdAndCategory(String userId, String category);
    
    // Deduplication queries
    Optional<SmartItem> findByUserIdAndOriginalEmailId(String userId, String originalEmailId);
    Optional<SmartItem> findByUserIdAndEmailHash(String userId, String emailHash);
}